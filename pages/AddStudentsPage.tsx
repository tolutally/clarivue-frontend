import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, UserPlus, Trash2, CheckCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/toast';
import { backgrounds } from '@/utils/colors';
import { Button } from '@/components/ui/button';
import { useBulkAddUsers } from '@/hooks/useCohorts';

interface StudentEntry {
  id: string;
  email: string;
  name: string;
  error?: string;
}

export function AddStudentsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const bulkAddUsers = useBulkAddUsers();
  
  const [students, setStudents] = useState<StudentEntry[]>([
    { id: '1', email: '', name: '' }
  ]);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleAddStudent = () => {
    setStudents([...students, { id: Date.now().toString(), email: '', name: '' }]);
  };

  const handleRemoveStudent = (id: string) => {
    if (students.length > 1) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const handleStudentChange = (id: string, field: 'email' | 'name', value: string) => {
    setStudents(students.map(s => 
      s.id === id ? { ...s, [field]: value, error: undefined } : s
    ));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Helper function to split name into first_name and last_name
  const splitName = (name: string): { first_name: string; last_name: string } => {
    const trimmed = name.trim();
    if (!trimmed) {
      return { first_name: '', last_name: '' };
    }
    
    const parts = trimmed.split(/\s+/);
    if (parts.length === 1) {
      return { first_name: parts[0], last_name: '' };
    }
    
    // First part is first_name, rest is last_name
    return {
      first_name: parts[0],
      last_name: parts.slice(1).join(' '),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validate all entries
    const validStudents = students.filter(s => s.email.trim() && s.name.trim());
    
    if (validStudents.length === 0) {
      setError('Please add at least one student with email and name');
      return;
    }

    // Validate emails
    const invalidEmails = validStudents.filter(s => !validateEmail(s.email));
    if (invalidEmails.length > 0) {
      setError('Some emails are invalid. Please check and try again.');
      setStudents(students.map(s => 
        invalidEmails.find(inv => inv.id === s.id) 
          ? { ...s, error: 'Invalid email format' }
          : s
      ));
      return;
    }

    try {
      // Transform students to match API format (split name into first_name and last_name)
      const users = validStudents.map(s => {
        const { first_name, last_name } = splitName(s.name);
        return {
          email: s.email.trim(),
          first_name,
          last_name,
        };
      });

      // Call the API using the hook
      await bulkAddUsers.mutateAsync({
        cohortId: id!,
        data: { users },
      });
      
      setSuccessMessage(`Successfully added ${validStudents.length} student${validStudents.length > 1 ? 's' : ''}`);
      toast.success('Students added!', `${validStudents.length} student${validStudents.length > 1 ? 's' : ''} added to cohort`);
      
      // Navigate to cohort detail page after 2 seconds
      setTimeout(() => {
        navigate(`/cohorts/${id}`);
      }, 2000);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error?.detail || err?.message || 'Failed to add students';
      setError(errorMessage);
      toast.error('Failed to add students', errorMessage);
    }
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    setError('');

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      // Skip header row if it contains "email" or "name"
      const startIndex = lines[0].toLowerCase().includes('email') || lines[0].toLowerCase().includes('name') ? 1 : 0;
      
      const parsedStudents: StudentEntry[] = [];
      
      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Simple CSV parsing (handles comma-separated values)
        const parts = line.split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
        
        if (parts.length >= 2) {
          parsedStudents.push({
            id: Date.now().toString() + i,
            email: parts[0],
            name: parts[1],
          });
        }
      }

      if (parsedStudents.length > 0) {
        setStudents(parsedStudents);
        setSuccessMessage(`Loaded ${parsedStudents.length} students from CSV`);
        toast.success('CSV loaded!', `${parsedStudents.length} students loaded from file`);
      } else {
        const errorMsg = 'No valid student data found in CSV. Expected format: email,name';
        setError(errorMsg);
        toast.error('CSV parsing failed', errorMsg);
      }
    } catch (err) {
      const errorMsg = 'Failed to parse CSV file. Please ensure it is properly formatted.';
      setError(errorMsg);
      toast.error('CSV error', errorMsg);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Students to Cohort</h1>
          <p className="text-gray-600 mb-8">
            Add students manually or upload a CSV file
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <div className="text-red-600 text-sm">{error}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div className="text-green-800 text-sm">{successMessage}</div>
            </div>
          )}

          <div className="mb-8">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Upload CSV File</h3>
              <p className="text-sm text-gray-600 mb-4">
                CSV should have columns: email, name
              </p>
              <label className="inline-block">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvUpload}
                  className="hidden"
                />
                <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer inline-block">
                  Choose File
                </span>
              </label>
              {csvFile && (
                <p className="text-sm text-gray-600 mt-3">
                  Selected: {csvFile.name}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-gray-300 flex-1"></div>
            <span className="text-sm text-gray-500 font-medium">OR ADD MANUALLY</span>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {students.map((student, index) => (
              <div key={student.id} className="flex gap-3 items-start">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="email"
                      value={student.email}
                      onChange={(e) => handleStudentChange(student.id, 'email', e.target.value)}
                      placeholder="student@example.com"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        student.error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {student.error && (
                      <p className="text-xs text-red-600 mt-1">{student.error}</p>
                    )}
                  </div>
                  <input
                    type="text"
                    value={student.name}
                    onChange={(e) => handleStudentChange(student.id, 'name', e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                {students.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStudent(student.id)}
                    className="p-3 text-gray-400 hover:text-red-600 transition-colors"
                    aria-label="Remove student"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="link"
              startIcon={<UserPlus className="w-4 h-4" />}
              onClick={handleAddStudent}
            >
              Add Another Student
            </Button>

            <div className="flex gap-4 pt-6 border-t border-gray-200 mt-8">
              <Button
                variant="outline"
                onClick={() => navigate(`/cohorts/${id}`)}
                size="lg"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={bulkAddUsers.isPending}
                size="lg"
                className="flex-1"
                startIcon={<UserPlus className="w-5 h-5" />}
              >
                {bulkAddUsers.isPending ? (
                  'Adding Students...'
                ) : (
                  'Add Students'
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">What happens next?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Students will be added to your cohort roster</li>
              <li>• You can send interview invitations from the cohort details page</li>
              <li>• Configure time limits and number of interviews when sending invites</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
