import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import { Tooltip } from '@mui/material';
import { SourcesList } from '../components/SourcesList';
import {
  useCreateSource,
  useDeleteSource,
  useSourcesList,
  type QueryParamDescriptor,
  type FilterDescriptor,
} from '../services/sources';
import JsonEditor from '../components/JsonEditor';
import InputField from '../components/InputField';
const FORM_ID = 'api_source_creation_form';

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
});

function RouteComponent() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState<'form' | 'json'>('form');
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState('');

  const getDefaultSource = (): any => ({
    name: '',
    description: '',
    endpoint: '',
    method: 'GET',
    mapping: {},
    api_filters: [],
    backend_filters: [],
    is_active: true,
    auth_required: false,
    api_key: '',
    rate_limit: 60,
    request_timeout: 30,
    supports_pagination: true,
    max_pages_for_backend_filters: 10,
    pagination_style: 'start_limit',
    headers: {},
  });
  // Fetch backend filter templates (types, operators hints)
  const backendFilterTemplates = {
    types: ['string', 'number', 'boolean', 'select'],
    operators: [
      'eq',
      'neq',
      'contains',
      'regex',
      'startswith',
      'endswith',
      'gt',
      'lt',
    ],
  };

  const [newSource, setNewSource] = useState<any>(getDefaultSource());

  // const queryClient = useQueryClient();
  const { data: apiSources = [], isLoading } = useSourcesList();

  // Sync between form and JSON views
  useEffect(() => {
    if (viewMode === 'json') {
      setJsonInput(JSON.stringify(newSource, null, 2));
    }
  }, [newSource, viewMode]);
  // Robust view toggle: when leaving JSON view, apply pending JSON edits
  const handleSwitchToForm = () => {
    if (viewMode === 'json') {
      try {
        const parsed = JSON.parse(jsonInput);
        setNewSource(parsed);
        setJsonError('');
        setViewMode('form');
      } catch (e) {
        setJsonError('Invalid JSON format');
        // stay in JSON view to fix errors
      }
    } else {
      setViewMode('form');
    }
  };

  const createSourceMutation = useCreateSource();

  const deleteSourceMutation = useDeleteSource();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setNewSource((prev: any) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
            ? value === ''
              ? undefined
              : Number(value)
            : value,
    }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (viewMode === 'json') {
      try {
        const parsed = JSON.parse(jsonInput);
        console.log('Submitting new source from JSON:', parsed);
        // createSourceMutation.mutate(parsed);
      } catch (error) {
        setJsonError('Invalid JSON format');
        return;
      }
    } else {
      console.log('Submitting new source:', newSource);
      // createSourceMutation.mutate(newSource);
    }
  };

  const loadExampleSources = async () => {
    try {
    } catch (error) {
      console.error('Failed to load example sources:', error);
    }
  };

  // API Filters editor handlers
  const addApiFilter = () => {
    setNewSource((prev: any) => ({
      ...prev,
      api_filters: [
        ...(prev.api_filters || []),
        {
          key: '',
          type: 'string',
          label: '',
          default: '',
          required: false,
          user_editable: true,
          hidden: false,
          options: [],
          api_param: '',
        },
      ],
    }));
  };

  const removeApiFilter = (idx: number) => {
    setNewSource((prev: any) => ({
      ...prev,
      api_filters: (prev.api_filters || []).filter(
        (_: any, i: number) => i !== idx,
      ),
    }));
  };

  const handleApiFilterChange = (
    idx: number,
    field: keyof QueryParamDescriptor,
    value: any,
  ) => {
    setNewSource((prev: any) => {
      const next = { ...prev };
      const list = [...(next.api_filters || [])];
      const item = { ...(list[idx] as any) };
      if (field === 'options') {
        item.options = (
          typeof value === 'string'
            ? value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            : value
        ) as string[];
      } else if (
        field === 'required' ||
        field === 'user_editable' ||
        field === 'hidden'
      ) {
        item[field] = Boolean(value);
      } else {
        item[field] = value;
      }
      list[idx] = item;
      next.api_filters = list as any;
      return next;
    });
  };

  // Backend Filters editor handlers
  const addBackendFilter = () => {
    setNewSource((prev: any) => ({
      ...prev,
      backend_filters: [
        ...(prev.backend_filters || []),
        {
          key: '',
          type: 'string',
          label: '',
          filterable: true,
          options: [],
          path: '',
          operators: [],
        },
      ],
    }));
  };

  const removeBackendFilter = (idx: number) => {
    setNewSource((prev: any) => ({
      ...prev,
      backend_filters: (prev.backend_filters || []).filter(
        (_: any, i: number) => i !== idx,
      ),
    }));
  };

  const handleBackendFilterChange = (
    idx: number,
    field: keyof FilterDescriptor,
    value: any,
  ) => {
    setNewSource((prev: any) => {
      const next = { ...prev };
      const list = [...(next.backend_filters || [])];
      const item = { ...(list[idx] as any) };
      if (field === 'options') {
        item.options = (
          typeof value === 'string'
            ? value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            : value
        ) as string[];
      } else if (field === 'operators') {
        item.operators = (
          typeof value === 'string'
            ? value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            : value
        ) as string[];
      } else if (field === 'filterable') {
        item[field] = Boolean(value);
      } else {
        item[field] = value;
      }
      list[idx] = item;
      next.backend_filters = list as any;
      return next;
    });
  };

  // Removed unused submitButtonLabel
  if (isLoading) {
    return (
      <div className='flex justify-center items-center py-12'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold text-gray-900'>Admin Panel</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        >
          {showAddForm ? 'Cancel' : 'Add API Source'}
        </button>
      </div>

      {showAddForm && (
        <div className='bg-white shadow rounded-lg p-6'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-semibold text-gray-900'>
              Add New API Source
            </h2>
            <div className='flex space-x-2'>
              <button
                type='button'
                onClick={loadExampleSources}
                className='px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700'
              >
                Load Examples
              </button>
              <div className='flex rounded-md shadow-sm'>
                <button
                  type='button'
                  onClick={handleSwitchToForm}
                  className={`px-3 py-1 text-sm font-medium rounded-l-md border ${
                    viewMode === 'form'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Form View
                </button>
                <button
                  type='button'
                  onClick={() => setViewMode('json')}
                  className={`px-3 py-1 text-sm font-medium rounded-r-md border-l-0 border ${
                    viewMode === 'json'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  JSON View
                </button>
              </div>
            </div>
          </div>

          {viewMode === 'json' ? (
            <JsonEditor
              value={jsonInput}
              onChange={setJsonInput}
              errorText={jsonError}
              onSubmit={handleSubmit}
              isLoading={createSourceMutation.isPending}
            />
          ) : (
            <form id={FORM_ID} onSubmit={handleSubmit} className='space-y-6'>
              {/* Basic Configuration */}
              <div className='border-b border-gray-200 pb-6'>
                <h3 className='text-lg font-medium text-gray-900 mb-4'>
                  Basic Configuration
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Name *
                    </label>
                    <InputField
                      label={undefined}
                      id='name'
                      name='name'
                      required
                      value={newSource.name}
                      onChange={handleInputChange}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2'
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='method'
                      className='block text-sm font-medium text-gray-700'
                    >
                      HTTP Method *
                    </label>
                    <select
                      name='method'
                      id='method'
                      required
                      value={newSource.method}
                      onChange={handleInputChange}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2'
                    >
                      <option value='GET'>GET</option>
                      <option value='POST'>POST</option>
                      <option value='PUT'>PUT</option>
                      <option value='DELETE'>DELETE</option>
                    </select>
                  </div>

                  <div className='md:col-span-2'>
                    <label
                      htmlFor='endpoint'
                      className='block text-sm font-medium text-gray-700'
                    >
                      API Endpoint *
                    </label>
                    <InputField
                      id='endpoint'
                      name='endpoint'
                      type='url'
                      required
                      value={newSource.endpoint}
                      onChange={handleInputChange}
                      // pattern='https://.*'
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2'
                      placeholder='https://api.example.com/v1/data'
                    />
                  </div>

                  <div className='md:col-span-2'>
                    <label
                      htmlFor='description'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Description
                    </label>
                    <textarea
                      name='description'
                      id='description'
                      rows={3}
                      value={newSource.description || ''}
                      onChange={handleInputChange}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2'
                      placeholder='Describe what this API provides...'
                    />
                  </div>
                </div>
              </div>

              {/* Authentication & Configuration */}
              <div className='border-b border-gray-200 pb-6'>
                <h3 className='text-lg font-medium text-gray-900 mb-4'>
                  Authentication & Configuration
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <div className='flex items-center'>
                      <InputField
                        id='auth_required'
                        name='auth_required'
                        type='checkbox'
                        checked={newSource.auth_required}
                        onChange={handleInputChange}
                        className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                      />
                      <label
                        htmlFor='auth_required'
                        className='ml-2 block text-sm text-gray-900'
                      >
                        Authentication Required
                      </label>
                    </div>
                  </div>

                  <div>
                    <div className='flex items-center'>
                      <InputField
                        id='is_active'
                        name='is_active'
                        type='checkbox'
                        checked={newSource.is_active}
                        onChange={handleInputChange}
                        className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded p-2'
                      />
                      <label
                        htmlFor='is_active'
                        className='ml-2 block text-sm text-gray-900'
                      >
                        Active
                      </label>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor='api_key'
                      className='block text-sm font-medium text-gray-700'
                    >
                      API Key
                    </label>
                    <InputField
                      id='api_key'
                      name='api_key'
                      type='password'
                      value={newSource.api_key || ''}
                      onChange={handleInputChange}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2'
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='request_timeout'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Request Timeout (seconds)
                    </label>
                    <InputField
                      id='request_timeout'
                      name='request_timeout'
                      type='number'
                      value={newSource.request_timeout}
                      onChange={handleInputChange}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2'
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='rate_limit'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Rate Limit (requests/minute)
                    </label>
                    <InputField
                      id='rate_limit'
                      name='rate_limit'
                      type='number'
                      value={newSource.rate_limit || ''}
                      onChange={handleInputChange}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2'
                    />
                  </div>
                </div>
              </div>

              {/* Pagination Settings */}
              {/* <div className='border-b border-gray-200 pb-6'>
                <h3 className='text-lg font-medium text-gray-900 mb-4'>
                  Pagination Settings
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div>
                    <div className='flex items-center'>
                      <input
                        type='checkbox'
                        name='supports_pagination'
                        id='supports_pagination'
                        checked={newSource.supports_pagination}
                        onChange={handleInputChange}
                        className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                      />
                      <label
                        htmlFor='supports_pagination'
                        className='ml-2 block text-sm text-gray-900'
                      >
                        Supports Pagination
                      </label>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor='max_pages_for_backend_filters'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Max Pages for Backend Filters
                    </label>
                    <input
                      type='number'
                      name='max_pages_for_backend_filters'
                      id='max_pages_for_backend_filters'
                      value={newSource.max_pages_for_backend_filters}
                      onChange={handleInputChange}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='pagination_style'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Pagination Style
                    </label>
                    <select
                      name='pagination_style'
                      id='pagination_style'
                      value={newSource.pagination_style || 'start_limit'}
                      onChange={handleInputChange}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                    >
                      <option value='start_limit'>Start + Limit</option>
                      <option value='page_limit'>Page + Limit</option>
                      <option value='offset_limit'>Offset + Limit</option>
                    </select>
                  </div>
                </div>
              </div> */}
              {/* API Filters */}
              <div className='border-b border-gray-200 pb-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-medium text-gray-900'>
                    <p className='inline-block mr-2'>API Filters</p>
                    <Tooltip title='Define the filters that users can set when querying this API source. These filters will be sent as query parameters in the API requests.'>
                      <InfoOutlineIcon sx={{ fontSize: 16 }} />
                    </Tooltip>
                  </h3>
                  <button
                    type='button'
                    onClick={addApiFilter}
                    className='px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200'
                  >
                    + Add
                  </button>
                </div>
                <div className='space-y-4'>
                  {(newSource.api_filters || []).map((f: any, idx: number) => (
                    <div
                      key={idx}
                      className='grid grid-cols-1 md:grid-cols-5 gap-3 items-end'
                    >
                      <div>
                        <label className='block text-sm text-gray-700'>
                          Key
                        </label>
                        <input
                          value={f.key || ''}
                          onChange={(e) =>
                            handleApiFilterChange(idx, 'key', e.target.value)
                          }
                          className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2'
                        />
                      </div>
                      <div>
                        <label className='block text-sm text-gray-700'>
                          Type
                        </label>
                        <select
                          value={f.type}
                          onChange={(e) =>
                            handleApiFilterChange(idx, 'type', e.target.value)
                          }
                          className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2'
                        >
                          <option value='string'>string</option>
                          <option value='number'>number</option>
                          <option value='boolean'>boolean</option>
                          <option value='select'>select</option>
                        </select>
                      </div>
                      <div>
                        <label className='block text-sm text-gray-700'>
                          Label
                        </label>
                        <input
                          value={f.label || ''}
                          onChange={(e) =>
                            handleApiFilterChange(idx, 'label', e.target.value)
                          }
                          className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2'
                        />
                      </div>
                      <div>
                        <label className='block text-sm text-gray-700'>
                          API Param
                        </label>
                        <input
                          value={f.api_param || ''}
                          onChange={(e) =>
                            handleApiFilterChange(
                              idx,
                              'api_param',
                              e.target.value,
                            )
                          }
                          className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2'
                        />
                      </div>
                      <div>
                        <label className='block text-sm text-gray-700'>
                          Options (comma)
                        </label>
                        <input
                          value={(f.options || []).join(', ')}
                          onChange={(e) =>
                            handleApiFilterChange(
                              idx,
                              'options',
                              e.target.value,
                            )
                          }
                          className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2'
                        />
                      </div>
                      <div className='flex items-center space-x-3 w-full'>
                        <label className='inline-flex items-center text-sm'>
                          <input
                            type='checkbox'
                            checked={!!f.required}
                            onChange={(e) =>
                              handleApiFilterChange(
                                idx,
                                'required',
                                e.target.checked,
                              )
                            }
                            className='mr-1'
                          />
                          Required
                        </label>
                        <label className='inline-flex items-center text-sm'>
                          <input
                            type='checkbox'
                            checked={!!f.user_editable}
                            onChange={(e) =>
                              handleApiFilterChange(
                                idx,
                                'user_editable',
                                e.target.checked,
                              )
                            }
                            className='mr-1'
                          />
                          Editable
                        </label>
                        <label className='inline-flex items-center text-sm'>
                          <input
                            type='checkbox'
                            checked={!!f.hidden}
                            onChange={(e) =>
                              handleApiFilterChange(
                                idx,
                                'hidden',
                                e.target.checked,
                              )
                            }
                            className='mr-1'
                          />
                          Hidden
                        </label>
                        <button
                          type='button'
                          onClick={() => removeApiFilter(idx)}
                          className='ml-auto text-red-600 hover:text-red-800'
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Backend Filters */}
              <div className='border-b border-gray-200 pb-6'>
                <div className='flex items-center justify-between mb-1'>
                  <h3 className='text-lg font-medium text-gray-900'>
                    <p className='inline-block mr-2'>Backend Filters</p>
                    <Tooltip title='Define the filters that can be applied to the backend data. These filters are extracted from the API response using JMESPath expressions and can be used for filtering results.'>
                      <InfoOutlineIcon sx={{ fontSize: 16 }} />
                    </Tooltip>
                  </h3>
                  <button
                    type='button'
                    onClick={addBackendFilter}
                    className='px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200'
                  >
                    + Add
                  </button>
                </div>
                {backendFilterTemplates && (
                  <p className='text-xs text-gray-500 mb-3'>
                    Supported types: {backendFilterTemplates.types.join(', ')}
                  </p>
                )}
                <div className='space-y-4'>
                  {(newSource.backend_filters || []).map(
                    (f: any, idx: number) => (
                      <div
                        key={idx}
                        className='grid grid-cols-1 md:grid-cols-7 gap-3 items-end'
                      >
                        <div>
                          <label className='block text-sm text-gray-700'>
                            Key
                          </label>
                          <input
                            value={f.key || ''}
                            onChange={(e) =>
                              handleBackendFilterChange(
                                idx,
                                'key',
                                e.target.value,
                              )
                            }
                            className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2'
                          />
                        </div>
                        <div>
                          <label className='block text-sm text-gray-700'>
                            Type
                          </label>
                          <select
                            value={f.type}
                            onChange={(e) =>
                              handleBackendFilterChange(
                                idx,
                                'type',
                                e.target.value,
                              )
                            }
                            className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2'
                          >
                            {(
                              backendFilterTemplates?.types || [
                                'string',
                                'number',
                                'boolean',
                                'select',
                              ]
                            ).map((t: string) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className='block text-sm text-gray-700'>
                            Label
                          </label>
                          <input
                            value={f.label || ''}
                            onChange={(e) =>
                              handleBackendFilterChange(
                                idx,
                                'label',
                                e.target.value,
                              )
                            }
                            className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2'
                          />
                        </div>
                        <div>
                          <label className='block text-sm text-gray-700'>
                            JMESPath
                          </label>
                          <input
                            value={f.path || ''}
                            onChange={(e) =>
                              handleBackendFilterChange(
                                idx,
                                'path',
                                e.target.value,
                              )
                            }
                            placeholder='e.g. quote.USD.price'
                            className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2'
                          />
                        </div>
                        <div>
                          <label className='block text-sm text-gray-700'>
                            Options (comma)
                          </label>
                          <input
                            value={(f.options || []).join(', ')}
                            onChange={(e) =>
                              handleBackendFilterChange(
                                idx,
                                'options',
                                e.target.value,
                              )
                            }
                            className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2'
                          />
                        </div>
                        <div>
                          <label className='block text-sm text-gray-700'>
                            Operators (comma)
                            <Tooltip
                              title={`Leave blank for default. Supported: ${backendFilterTemplates.operators.join(', ')}`}
                              placement='top'
                            >
                              <InfoOutlineIcon
                                sx={{
                                  fontSize: 16,
                                  marginLeft: '4px',
                                  verticalAlign: 'middle',
                                }}
                              />
                            </Tooltip>
                          </label>
                          <input
                            value={(f.operators || []).join(', ')}
                            onChange={(e) =>
                              handleBackendFilterChange(
                                idx,
                                'operators',
                                e.target.value,
                              )
                            }
                            placeholder={backendFilterTemplates.operators.join(
                              ', ',
                            )}
                            className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2'
                          />
                        </div>
                        <div className='flex items-center space-x-3'>
                          <label className='inline-flex items-center text-sm'>
                            <input
                              type='checkbox'
                              checked={f.filterable !== false}
                              onChange={(e) =>
                                handleBackendFilterChange(
                                  idx,
                                  'filterable',
                                  e.target.checked,
                                )
                              }
                              className='mr-1'
                            />
                            Filterable
                          </label>
                          <button
                            type='button'
                            onClick={() => removeBackendFilter(idx)}
                            className='ml-auto text-red-600 hover:text-red-800'
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
              <div className='flex justify-end'>
                <button
                  type='submit'
                  form={FORM_ID}
                  disabled={createSourceMutation.isPending}
                  className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'
                >
                  {createSourceMutation.isPending
                    ? 'Creating...'
                    : 'Create Source'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* API Sources List */}
      <SourcesList
        sources={apiSources}
        onDelete={deleteSourceMutation.mutate}
      />
    </div>
  );
}
