import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, X, ChevronDown, Building2 } from 'lucide-react';
import { Header } from '../components/Header';
import { Button } from '@/components/ui/button';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/toast';
import { backgrounds } from '@/utils/colors';
import { useCohort, useUpdateCohort } from '@/hooks/useCohorts';
import { useTerms, useCreateTerm } from '@/hooks/useTerms';
import { usePrograms, useCreateProgram } from '@/hooks/usePrograms';
import { useObjectives, useCreateObjective } from '@/hooks/useObjectives';
import { useCustomTags, useCreateCustomTag } from '@/hooks/useCustomTags';
import { useAuth } from '@/contexts/AuthContext';

interface ObjectiveEntry {
  id: string;
  objectiveId: string; // ID from API
}

interface CustomTagEntry {
  id: string;
  name: string;
  tagId?: string; // ID from API if created
}

export function UpdateCohortPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const { admin } = useAuth();

  // Fetch existing cohort
  const { data: cohortData, isLoading: cohortLoading } = useCohort(id);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [termId, setTermId] = useState<string>('');
  const [programId, setProgramId] = useState<string>('');
  const [customTags, setCustomTags] = useState<CustomTagEntry[]>([]);
  const [objectives, setObjectives] = useState<ObjectiveEntry[]>([{ id: '1', objectiveId: '' }]);
  const [error, setError] = useState('');

  // Dropdown states
  const [termDropdownOpen, setTermDropdownOpen] = useState(false);
  const [programDropdownOpen, setProgramDropdownOpen] = useState(false);
  const [objectiveDropdownOpen, setObjectiveDropdownOpen] = useState<Record<string, boolean>>({});
  const [termSearch, setTermSearch] = useState('');
  const [programSearch, setProgramSearch] = useState('');
  const [objectiveSearch, setObjectiveSearch] = useState<Record<string, string>>({});
  const termDropdownRef = useRef<HTMLDivElement>(null);
  const programDropdownRef = useRef<HTMLDivElement>(null);
  const objectiveDropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Prefill form when cohort data loads
  useEffect(() => {
    if (cohortData) {
      setName(cohortData.name || '');
      setDescription(cohortData.description || '');
      setTermId(cohortData.term?._id || '');
      setProgramId(cohortData.program?._id || '');
      
      // Set custom tags
      if (cohortData.custom_tags && cohortData.custom_tags.length > 0) {
        setCustomTags(
          cohortData.custom_tags.map((tag, index) => ({
            id: `tag-${index}`,
            name: tag.name,
            tagId: tag._id,
          }))
        );
      }
      
      // Set objectives
      if (cohortData.objectives && cohortData.objectives.length > 0) {
        setObjectives(
          cohortData.objectives.map((obj, index) => ({
            id: `obj-${index}`,
            objectiveId: obj._id,
          }))
        );
      } else {
        setObjectives([{ id: '1', objectiveId: '' }]);
      }
    }
  }, [cohortData]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (termDropdownRef.current && !termDropdownRef.current.contains(event.target as Node)) {
        setTermDropdownOpen(false);
      }
      if (programDropdownRef.current && !programDropdownRef.current.contains(event.target as Node)) {
        setProgramDropdownOpen(false);
      }
      
      // Close objective dropdowns
      Object.entries(objectiveDropdownRefs.current).forEach(([id, ref]) => {
        if (ref && !ref.contains(event.target as Node)) {
          setObjectiveDropdownOpen(prev => ({ ...prev, [id]: false }));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hooks for fetching data
  const { data: termsData } = useTerms({ page_size: 100 });
  const { data: programsData } = usePrograms({ page_size: 100 });
  const { data: objectivesData } = useObjectives({ page_size: 100 });
  const { data: customTagsData } = useCustomTags({ page_size: 100 });

  // Hooks for creating
  const updateCohort = useUpdateCohort();
  const createTerm = useCreateTerm();
  const createProgram = useCreateProgram();
  const createObjective = useCreateObjective();
  const createCustomTag = useCreateCustomTag();

  const terms = termsData?.items || [];
  const programs = programsData?.items || [];
  const existingObjectives = objectivesData?.items || [];
  const existingCustomTags = customTagsData?.items || [];

  // Get selected term/program names for display
  const selectedTerm = terms.find(t => t._id === termId);
  const selectedProgram = programs.find(p => p._id === programId);

  // Filter terms/programs based on search
  const filteredTerms = useMemo(() => {
    if (!termSearch.trim()) return terms;
    return terms.filter(t => 
      t.name.toLowerCase().includes(termSearch.toLowerCase())
    );
  }, [terms, termSearch]);

  const filteredPrograms = useMemo(() => {
    if (!programSearch.trim()) return programs;
    return programs.filter(p => 
      p.name.toLowerCase().includes(programSearch.toLowerCase())
    );
  }, [programs, programSearch]);

  const handleCreateTerm = async (termName: string) => {
    try {
      const newTerm = await createTerm.mutateAsync({ name: termName, is_global: false });
      setTermId(newTerm._id);
      setTermDropdownOpen(false);
      setTermSearch('');
      toast.success('Term created!', `"${termName}" has been created`);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error?.detail || err?.message || 'Failed to create term';
      toast.error('Failed to create term', errorMsg);
    }
  };

  const handleCreateProgram = async (programName: string) => {
    try {
      const newProgram = await createProgram.mutateAsync({ name: programName, is_global: false });
      setProgramId(newProgram._id);
      setProgramDropdownOpen(false);
      setProgramSearch('');
      toast.success('Program created!', `"${programName}" has been created`);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error?.detail || err?.message || 'Failed to create program';
      toast.error('Failed to create program', errorMsg);
    }
  };

  const handleAddObjective = () => {
    setObjectives([...objectives, { id: Date.now().toString(), objectiveId: '' }]);
  };

  const handleRemoveObjective = (id: string) => {
    setObjectives(objectives.filter(obj => obj.id !== id));
    setObjectiveDropdownOpen(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
    setObjectiveSearch(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const handleSelectObjective = (objectiveId: string, entryId: string) => {
    setObjectives(objectives.map(obj => 
      obj.id === entryId ? { ...obj, objectiveId } : obj
    ));
    setObjectiveDropdownOpen(prev => ({ ...prev, [entryId]: false }));
    setObjectiveSearch(prev => ({ ...prev, [entryId]: '' }));
  };

  const handleCreateObjective = async (objectiveName: string, entryId: string) => {
    try {
      const newObjective = await createObjective.mutateAsync({ 
        name: objectiveName.trim(), 
        is_global: false 
      });
      handleSelectObjective(newObjective._id, entryId);
      toast.success('Objective created!', `"${objectiveName}" has been created`);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error?.detail || err?.message || 'Failed to create objective';
      toast.error('Failed to create objective', errorMsg);
    }
  };

  const filteredObjectives = useMemo(() => {
    return (objectiveId: string) => {
      const search = objectiveSearch[objectiveId] || '';
      if (!search.trim()) return existingObjectives;
      return existingObjectives.filter(obj => 
        obj.name.toLowerCase().includes(search.toLowerCase())
      );
    };
  }, [existingObjectives, objectiveSearch]);

  const handleAddCustomTag = async (tagName?: string) => {
    const tagToAdd = tagName?.trim();
    if (!tagToAdd) return;

    // Check if tag already exists
    const existingTag = existingCustomTags.find(t => 
      t.name.toLowerCase() === tagToAdd.toLowerCase()
    );

    if (existingTag) {
      // Use existing tag
      if (!customTags.find(t => t.tagId === existingTag._id)) {
        setCustomTags([...customTags, { 
          id: Date.now().toString(), 
          name: existingTag.name, 
          tagId: existingTag._id 
        }]);
      }
    } else {
      // Create new tag
      try {
        const newTag = await createCustomTag.mutateAsync({ 
          name: tagToAdd, 
          is_global: false 
        });
        setCustomTags([...customTags, { 
          id: Date.now().toString(), 
          name: newTag.name, 
          tagId: newTag._id 
        }]);
        toast.success('Tag created!', `"${tagToAdd}" has been created`);
      } catch (err: any) {
        const errorMsg = err?.response?.data?.error?.detail || err?.message || 'Failed to create tag';
        toast.error('Failed to create tag', errorMsg);
      }
    }
  };

  const handleRemoveTag = (id: string) => {
    setCustomTags(customTags.filter(t => t.id !== id));
  };

  const handleSelectExistingTag = (tag: { _id: string; name: string }) => {
    if (!customTags.find(t => t.tagId === tag._id)) {
      setCustomTags([...customTags, { 
        id: Date.now().toString(), 
        name: tag.name, 
        tagId: tag._id 
      }]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');

    // Get objective IDs (all should already have IDs from dropdown selection/creation)
    const objectiveIds = objectives
      .filter(obj => obj.objectiveId)
      .map(obj => obj.objectiveId);

    // Get custom tag IDs
    const customTagIds = customTags
      .filter(t => t.tagId)
      .map(t => t.tagId!);

    try {
      await updateCohort.mutateAsync({
        id,
        data: {
          name: name.trim(),
          description: description.trim() || undefined,
          term_id: termId || undefined,
          program_id: programId || undefined,
          custom_tag_ids: customTagIds.length > 0 ? customTagIds : undefined,
          objective_ids: objectiveIds.length > 0 ? objectiveIds : undefined,
        },
      });

      toast.success('Cohort updated!', `${name} has been updated successfully`);
      
      setTimeout(() => {
        navigate(`/cohorts/${id}`);
      }, 1000);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error?.detail || err?.message || 'Failed to update cohort';
      setError(errorMessage);
      toast.error('Failed to update cohort', errorMessage);
    }
  };

  const loading = cohortLoading || updateCohort.isPending || createTerm.isPending || createProgram.isPending || 
                  createObjective.isPending || createCustomTag.isPending;

  if (cohortLoading) {
    return (
      <div className={`min-h-screen ${backgrounds.surfaceActive} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cohort...</p>
        </div>
      </div>
    );
  }

  if (!cohortData) {
    return (
      <div className={`min-h-screen ${backgrounds.surfaceActive} flex items-center justify-center`}>
        <div className="text-center">
          <p className="text-gray-600">Cohort not found</p>
          <Button onClick={() => navigate('/cohorts')} variant="primary" className="mt-4">
            Back to Cohorts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${backgrounds.surfaceActive}`}>
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
      <Header activeTab="cohorts" onTabChange={(tab) => {
        if (tab === 'overview') navigate('/overview');
        if (tab === 'cohorts') navigate('/cohorts');
        if (tab === 'students') navigate('/students');
        if (tab === 'reports') navigate('/reports');
      }} />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Button
          onClick={() => navigate(`/cohorts/${id}`)}
          variant="ghost"
          startIcon={<ArrowLeft className="w-5 h-5" />}
          className="text-gray-600 hover:text-gray-900 mb-6 w-fit"
        >
          Back to Cohort
        </Button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Update Cohort</h1>
          <p className="text-gray-600 mb-8">
            Update the details of your cohort
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cohort Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Fall 2025 CS Seniors"
                maxLength={100}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">{name.length}/100 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Computer Science graduating class preparing for technical interviews"
                maxLength={500}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{description.length}/500 characters</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Term Select */}
              <div className="relative" ref={termDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Term
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setTermDropdownOpen(!termDropdownOpen);
                      setProgramDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-left flex items-center justify-between"
                  >
                    <span className={selectedTerm ? 'text-gray-900' : 'text-gray-500'}>
                      {selectedTerm?.name || 'Select or create term...'}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${termDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {termDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-hidden">
                      <div className="p-2 border-b border-gray-200">
                        <input
                          type="text"
                          value={termSearch}
                          onChange={(e) => setTermSearch(e.target.value)}
                          placeholder="Search or type to create..."
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredTerms.map((term) => (
                          <button
                            key={term._id}
                            type="button"
                            onClick={() => {
                              setTermId(term._id);
                              setTermDropdownOpen(false);
                              setTermSearch('');
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                              termId === term._id ? 'bg-primary/10 text-primary' : ''
                            }`}
                          >
                            {term.name}
                          </button>
                        ))}
                        {termSearch.trim() && !filteredTerms.some(t => 
                          t.name.toLowerCase() === termSearch.toLowerCase()
                        ) && (
                          <button
                            type="button"
                            onClick={() => handleCreateTerm(termSearch.trim())}
                            className="w-full text-left px-4 py-2 text-sm border-t border-gray-200 hover:bg-primary/10 text-primary font-medium flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Create "{termSearch.trim()}"
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Program Select */}
              <div className="relative" ref={programDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setProgramDropdownOpen(!programDropdownOpen);
                      setTermDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-left flex items-center justify-between"
                  >
                    <span className={selectedProgram ? 'text-gray-900' : 'text-gray-500'}>
                      {selectedProgram?.name || 'Select or create program...'}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${programDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {programDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-hidden">
                      <div className="p-2 border-b border-gray-200">
                        <input
                          type="text"
                          value={programSearch}
                          onChange={(e) => setProgramSearch(e.target.value)}
                          placeholder="Search or type to create..."
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredPrograms.map((program) => (
                          <button
                            key={program._id}
                            type="button"
                            onClick={() => {
                              setProgramId(program._id);
                              setProgramDropdownOpen(false);
                              setProgramSearch('');
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                              programId === program._id ? 'bg-primary/10 text-primary' : ''
                            }`}
                          >
                            {program.name}
                          </button>
                        ))}
                        {programSearch.trim() && !filteredPrograms.some(p => 
                          p.name.toLowerCase() === programSearch.toLowerCase()
                        ) && (
                          <button
                            type="button"
                            onClick={() => handleCreateProgram(programSearch.trim())}
                            className="w-full text-left px-4 py-2 text-sm border-t border-gray-200 hover:bg-primary/10 text-primary font-medium flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Create "{programSearch.trim()}"
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Custom Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Tags
              </label>
              
              {/* Show existing tags that can be selected */}
              {existingCustomTags.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">Available tags (click to add):</p>
                  <div className="flex flex-wrap gap-2">
                    {existingCustomTags
                      .filter(tag => !customTags.find(t => t.tagId === tag._id))
                      .map((tag) => (
                        <Button
                          key={tag._id}
                          type="button"
                          onClick={() => handleSelectExistingTag(tag)}
                          variant="ghost"
                          size="sm"
                          className="bg-primary/10 text-primary rounded-full text-sm hover:bg-primary hover:text-white transition-colors"
                        >
                          + {tag.name}
                        </Button>
                      ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomTag((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                  placeholder="Type tag name and press Enter..."
                  maxLength={50}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Button
                  type="button"
                  onClick={(e) => {
                    const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                    if (input) {
                      handleAddCustomTag(input.value);
                      input.value = '';
                    }
                  }}
                  variant="ghost"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Add
                </Button>
              </div>
              
              {/* Selected tags */}
              {customTags.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Selected tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {customTags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-2"
                      >
                        {tag.name}
                        <Button
                          type="button"
                          onClick={() => handleRemoveTag(tag.id)}
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-gray-700"
                          aria-label={`Remove ${tag.name} tag`}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Objectives */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objectives
              </label>
              <p className="text-xs text-gray-500 mb-3">
                What goals do you want students to achieve?
              </p>
              <div className="space-y-3">
                {objectives.map((objective) => {
                  const selectedObjective = existingObjectives.find(obj => obj._id === objective.objectiveId);
                  const filtered = filteredObjectives(objective.id);
                  
                  return (
                    <div key={objective.id} className="flex gap-2">
                      <div 
                        className="relative flex-1"
                        ref={(el) => {
                          if (el) objectiveDropdownRefs.current[objective.id] = el;
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setObjectiveDropdownOpen(prev => ({
                              ...prev,
                              [objective.id]: !prev[objective.id]
                            }));
                            setTermDropdownOpen(false);
                            setProgramDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-left flex items-center justify-between"
                        >
                          <span className={selectedObjective ? 'text-gray-900' : 'text-gray-500'}>
                            {selectedObjective?.name || 'Select or create objective...'}
                          </span>
                          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${objectiveDropdownOpen[objective.id] ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {objectiveDropdownOpen[objective.id] && (
                          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-hidden">
                            <div className="p-2 border-b border-gray-200">
                              <input
                                type="text"
                                value={objectiveSearch[objective.id] || ''}
                                onChange={(e) => setObjectiveSearch(prev => ({
                                  ...prev,
                                  [objective.id]: e.target.value
                                }))}
                                placeholder="Search or type to create..."
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                autoFocus
                              />
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                              {filtered.map((obj) => (
                                <button
                                  key={obj._id}
                                  type="button"
                                  onClick={() => handleSelectObjective(obj._id, objective.id)}
                                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                                    objective.objectiveId === obj._id ? 'bg-primary/10 text-primary' : ''
                                  }`}
                                >
                                  {obj.name}
                                </button>
                              ))}
                              {objectiveSearch[objective.id]?.trim() && !filtered.some(obj => 
                                obj.name.toLowerCase() === objectiveSearch[objective.id]?.toLowerCase()
                              ) && (
                                <button
                                  type="button"
                                  onClick={() => handleCreateObjective(objectiveSearch[objective.id]?.trim() || '', objective.id)}
                                  className="w-full text-left px-4 py-2 text-sm border-t border-gray-200 hover:bg-primary/10 text-primary font-medium flex items-center gap-2"
                                >
                                  <Plus className="w-4 h-4" />
                                  Create "{objectiveSearch[objective.id]?.trim()}"
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      {objectives.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => handleRemoveObjective(objective.id)}
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-red-600 transition-colors"
                          aria-label="Remove objective"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
              <Button
                type="button"
                onClick={handleAddObjective}
                variant="ghost"
                className="mt-3 text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1 w-fit"
                startIcon={<Plus className="w-4 h-4" />}
              >
                Add Another Objective
              </Button>
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                onClick={() => navigate(`/cohorts/${id}`)}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={!name.trim()}
                variant="primary"
                className="flex-1"
                size="lg"
              >
                Update Cohort
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

