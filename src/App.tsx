import React, { useState, useEffect, useRef } from 'react';
import { Building2, Users, ClipboardCheck, BedDouble, Info, GripVertical, UserPlus, Check, X, Bell, Search, AlertTriangle, User } from 'lucide-react';
import * as XLSX from "xlsx";

interface UserProfile {
  name: string;
  registrationNumber: string;
  gender: string;
  course: string;
  year: string;
  rank: number;
  email?: string;
  phone?: string;
  address?: string;
}

interface StudentData {
  name: string;
  registrationNumber: string;
  gender: string;
  course: string;
  year: string;
}

interface RoomType {
  id: string;
  block: string;
  type: string;
  capacity: string;
  price: string;
}

interface Friend {
  id: string;
  name: string;
  registrationNumber: string;
  rank: number; // Added rank property
  status: 'pending' | 'accepted' | 'rejected';
}

interface RoommateRequest {
  id: string;
  from: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface Student {
  id: string;
  name: string;
  registrationNumber: string;
  gender: string;
  course: string;
  year: string;
  rank: number; // Added rank property
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [step, setStep] = useState(0);
  const [loginData, setLoginData] = useState({
    applicationNo: '',
    dob: '',
  });
  const [studentData, setStudentData] = useState<StudentData & { rank: number }>({
    name: '',
    registrationNumber: '',
    gender: '',
    course: '',
    year: '',
    rank: 0,
  });
  const [roomPreferences, setRoomPreferences] = useState<RoomType[]>([
    { id: '1', block: 'Premium', type: '4- Bedded Bunk Non AC Rooms', capacity: '4', price: '₹1,50,000/year' },
    { id: '2', block: 'Premium', type: '4- Bedded Flat Non AC Rooms', capacity: '4', price: '₹1,50,000/year' },
    { id: '3', block: 'Normal', type: '4- Bedded Bunk Non AC Rooms', capacity: '4', price: '₹1,50,000/year' },
    { id: '4', block: 'Normal', type: '4- Bedded Flat Non AC Rooms', capacity: '4', price: '₹1,50,000/year' },
    { id: '5', block: 'Normal', type: '4- Bedded Bunk Non AC Rooms', capacity: '4', price: '₹1,50,000/year' },
    { id: '6', block: 'Normal', type: '6- Bedded Bunk Non AC Rooms', capacity: '6', price: '₹1,50,000/year' },
    { id: '7', block: 'Normal', type: '6- Bedded Bunk AC Rooms', capacity: '6', price: '₹1,50,000/year' },
    { id: '8', block: 'Normal', type: '4- Bedded Bunk AC Rooms', capacity: '4', price: '₹1,50,000/year' },
    { id: '9', block: 'Premium', type: '4- Bedded Bunk AC Rooms', capacity: '4', price: '₹1,50,000/year' },
    { id: '10', block: 'Premium', type: '4- Bedded Flat AC Rooms', capacity: '4', price: '₹1,50,000/year' },
    { id: '11', block: 'Normal', type: '3- Bedded Bunk Non AC Rooms', capacity: '3', price: '₹1,50,000/year' },
    { id: '12', block: 'Normal', type: '3- Bedded Flat Non AC Rooms', capacity: '3', price: '₹1,50,000/year' },
    { id: '13', block: 'Premium', type: '3- Bedded Flat Non AC Rooms', capacity: '3', price: '₹1,50,000/year' },
    { id: '14', block: 'Premium', type: '3- Bedded Flat AC Rooms', capacity: '3', price: '₹1,50,000/year' },
    { id: '15', block: 'Normal', type: '3- Bedded Flat AC Rooms', capacity: '3', price: '₹1,50,000/year' },
    { id: '16', block: 'Normal', type: '2- Bedded Bunk Non AC Rooms', capacity: '2', price: '₹1,50,000/year' },
    { id: '17', block: 'Normal', type: '2- Bedded Flat Non AC Rooms', capacity: '2', price: '₹1,50,000/year' },
    { id: '18', block: 'Premium', type: '2- Bedded Flat Non AC Rooms', capacity: '2', price: '₹1,50,000/year' },
    { id: '19', block: 'Normal', type: '2- Bedded Flat AC Rooms', capacity: '2', price: '₹1,50,000/year' },
    { id: '20', block: 'Premium', type: '2- Bedded Flat AC Rooms', capacity: '2', price: '₹1,50,000/year' },
    
  ]);

  // State for all students loaded from Excel
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);
  const [roommateRequests, setRoommateRequests] = useState<RoommateRequest[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Load data from Excel file
  useEffect(() => {
    const loadStudentData = async () => {
      try {
        setIsLoading(true);
        console.log("Loading student data from Excel file...");
        
        // Path to the Excel file
        const filePath = "/Data.xlsx";
        
        // Fetch the Excel file
        const response = await fetch(filePath);
        const arrayBuffer = await response.arrayBuffer();
        
        // Parse the Excel data
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        // Get the first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        // Convert the worksheet to JSON
        const excelData = XLSX.utils.sheet_to_json<any>(worksheet);
        
        // Map the data to our Student interface
        const students: Student[] = excelData.map((row, index) => ({
          id: (index + 1).toString(),
          name: row['Name'] || '',
          registrationNumber: row['Reg No'] || '',
          gender: row['Gender'] || '',
          course: 'B.Tech', // Default value as it's not in the Excel file
          year: '3', // Default value as it's not in the Excel file
          rank: parseInt(row['Rank']) || 0
        }));
        
        setAllStudents(students);
        console.log("Student data loaded successfully", students);
      } catch (error) {
        console.error('Error loading student data from Excel:', error);
        setErrorMessage("Failed to load student data. Please check if the Excel file exists and is correctly formatted.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStudentData();
  }, []);

  // Filter students based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allStudents.filter(student => 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log("Filtered students:", filtered);
      setFilteredStudents(filtered);
      setShowDropdown(true);
    } else {
      setFilteredStudents([]);
      setShowDropdown(false);
    }
  }, [searchQuery, allStudents]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const saveUserToMongoDB = async (userData: UserProfile) => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to save user data');
      }

      console.log("User data saved successfully");
    } catch (error) {
      console.error("Error saving user to MongoDB:", error);
    }
  };

  const fetchUserProfile = async (registrationNumber: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${registrationNumber}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const user = await response.json();
      
      if (user) {
        const userProfile: UserProfile = {
          name: user.name,
          registrationNumber: user.registrationNumber,
          gender: user.gender,
          course: user.course,
          year: user.year,
          rank: user.rank,
          email: user.email,
          phone: user.phone,
          address: user.address
        };
        setUserProfile(userProfile);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Modify handleLogin to save user data to MongoDB
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const student = allStudents.find(s => s.registrationNumber === loginData.applicationNo);
    
    if (student) {
      setIsLoggedIn(true);
      setStep(1);
      const userData = {
        name: student.name,
        registrationNumber: student.registrationNumber,
        gender: student.gender,
        course: student.course,
        year: student.year,
        rank: student.rank,
      };
      setStudentData(userData);
      await saveUserToMongoDB(userData);
      await fetchUserProfile(student.registrationNumber);
      setErrorMessage(null);
    } else {
      setErrorMessage("Invalid application number. Please check and try again.");
    }
  };

  const handleRoomPreferenceChange = (dragIndex: number, dropIndex: number) => {
    const newPreferences = [...roomPreferences];
    const [draggedItem] = newPreferences.splice(dragIndex, 1);
    newPreferences.splice(dropIndex, 0, draggedItem);
    setRoomPreferences(newPreferences);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    handleRoomPreferenceChange(dragIndex, dropIndex);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSelectStudent = (student: Student) => {
    // Check if student is already selected
    const exists = selectedFriends.some(friend => friend.registrationNumber === student.registrationNumber);
    
    if (exists) {
      setErrorMessage("This student is already in your selection.");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    
    // Check rank difference
    const rankDifference = Math.abs(student.rank - studentData.rank);
    if (rankDifference > 500) {
      setErrorMessage(`Cannot select this student. Rank difference (${rankDifference}) exceeds 500.`);
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    
    // Add to selected friends
    setSelectedFriends([
      ...selectedFriends,
      {
        id: student.id,
        name: student.name,
        registrationNumber: student.registrationNumber,
        rank: student.rank,
        status: 'pending'
      }
    ]);
    
    // Clear search after selection
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleRoommateRequest = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.map(friend => 
        friend.id === friendId 
          ? { ...friend, status: 'pending' }
          : friend
      )
    );
  };

  const handleRequestResponse = (requestId: string, status: 'accepted' | 'rejected') => {
    setRoommateRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? { ...request, status }
          : request
      )
    );
  };

  const handleRemoveFriend = (friendId: string) => {
    setSelectedFriends(prev => prev.filter(friend => friend.id !== friendId));
  };

  const renderProfileModal = () => {
    if (!showProfile || !userProfile) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Profile Details</h2>
            <button
              onClick={() => setShowProfile(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <p className="text-lg text-gray-800">{userProfile.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Registration Number</label>
              <p className="text-lg text-gray-800">{userProfile.registrationNumber}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Gender</label>
              <p className="text-lg text-gray-800">{userProfile.gender}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Course</label>
              <p className="text-lg text-gray-800">{userProfile.course}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Year</label>
              <p className="text-lg text-gray-800">{userProfile.year}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Rank</label>
              <p className="text-lg text-gray-800">{userProfile.rank}</p>
            </div>
            {userProfile.email && (
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-lg text-gray-800">{userProfile.email}</p>
              </div>
            )}
            {userProfile.phone && (
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-lg text-gray-800">{userProfile.phone}</p>
              </div>
            )}
            {userProfile.address && (
              <div>
                <label className="text-sm font-medium text-gray-600">Address</label>
                <p className="text-lg text-gray-800">{userProfile.address}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {isLoggedIn && (
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-indigo-600">Hostel Management System</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowProfile(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <User size={20} />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isLoggedIn ? (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Login</h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Application Number</label>
                <input
                  type="text"
                  value={loginData.applicationNo}
                  onChange={(e) => setLoginData({ ...loginData, applicationNo: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  value={loginData.dob}
                  onChange={(e) => setLoginData({ ...loginData, dob: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              {errorMessage && (
                <div className="text-red-600 text-sm">{errorMessage}</div>
              )}
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Login
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8">
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Roommates</h2>
                <div className="relative" ref={searchRef}>
                  <div className="flex items-center space-x-2">
                    <Search className="text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search by name or registration number..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  {showDropdown && filteredStudents.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredStudents.map((student) => (
                        <div
                          key={student.id}
                          onClick={() => handleSelectStudent(student)}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.registrationNumber}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Selected Roommates</h3>
                  <div className="space-y-4">
                    {selectedFriends.map((friend) => (
                      <div
                        key={friend.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{friend.name}</div>
                          <div className="text-sm text-gray-500">{friend.registrationNumber}</div>
                        </div>
                        <button
                          onClick={() => handleRemoveFriend(friend.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Room Preferences</h2>
                <div className="space-y-4">
                  {roomPreferences.map((room, index) => (
                    <div
                      key={room.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragOver={handleDragOver}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg cursor-move"
                    >
                      <GripVertical className="text-gray-400" size={20} />
                      <div className="flex-1">
                        <div className="font-medium">{room.type}</div>
                        <div className="text-sm text-gray-500">
                          {room.block} Block • Capacity: {room.capacity} • {room.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Confirmation</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Selected Roommates</h3>
                    <div className="space-y-2">
                      {selectedFriends.map((friend) => (
                        <div key={friend.id} className="flex items-center space-x-2">
                          <Check className="text-green-500" size={20} />
                          <span>{friend.name} ({friend.registrationNumber})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Room Preferences</h3>
                    <div className="space-y-2">
                      {roomPreferences.slice(0, 3).map((room, index) => (
                        <div key={room.id} className="flex items-center space-x-2">
                          <span className="text-indigo-600 font-medium">{index + 1}.</span>
                          <span>{room.type} ({room.block} Block)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        // Handle final submission
                        setStep(4);
                      }}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="bg-white rounded-lg shadow-xl p-8 text-center">
                <Check className="mx-auto text-green-500" size={64} />
                <h2 className="text-2xl font-bold text-gray-800 mt-4">Submission Successful!</h2>
                <p className="text-gray-600 mt-2">Your hostel preferences have been submitted successfully.</p>
                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    setStep(0);
                  }}
                  className="mt-8 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {renderProfileModal()}
    </div>
  );
}

export default App;