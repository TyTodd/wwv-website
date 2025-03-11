"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

// Define an interface for the form data
interface FormDataType {
  [key: string]: string | string[] | FileAttachment[] | undefined;
  email?: string;
}

interface FileAttachment {
  url: string;
  filename: string;
}

export default function Profile() {
  const [userType, setUserType] = useState("");
  const { user, isLoaded } = useUser();
  const [formData, setFormData] = useState<FormDataType>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    message: "",
  });
  useEffect(() => {
    if (isLoaded && user) {
      console.log(user);
    }
  }, [isLoaded, user]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value, type, checked, files } = e.target as HTMLInputElement;

    if (type === "file" && files && files.length > 0) {
      // Handle file upload
      const file = files[0];
      // Create a URL for the file
      const fileUrl = URL.createObjectURL(file);
      console.log("fileUrl", fileUrl);
      console.log("file", file);

      setFormData((prev) => ({
        ...prev,
        [id]: [
          {
            url: fileUrl,
            filename: file.name,
          },
        ],
      }));
    } else if (type === "checkbox") {
      // For checkboxes, handle multiple selections
      setFormData((prev) => {
        const fieldName = e.target.name;
        const prevValues = (prev[fieldName] as string[]) || [];

        if (checked) {
          return { ...prev, [fieldName]: [...prevValues, value] };
        } else {
          return {
            ...prev,
            [fieldName]: prevValues.filter((v: string) => v !== value),
          };
        }
      });
    } else {
      // For other input types
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: "" });

    try {
      // Combine user data with form data
      let dataToSubmit = {
        ...formData,
        userType,
        email: user?.primaryEmailAddress?.emailAddress || formData.email,
        user_id: user?.id,
        work_authorization:
          formData.work_authorization === "yes" ? true : false,
        visa_sponsorship: formData.visa_sponsorship === "yes" ? true : false,
      };
      console.log(dataToSubmit);
      // Remove termsAgreement from formData before submitting
      delete (dataToSubmit as any).termsAgreement;
      delete (dataToSubmit as any).userType;

      const response = await fetch("/api/create-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: "Profile created successfully!",
        });
        window.location.href = "/profile";
        // Optionally redirect or clear form
      } else {
        const errorData = await response.json();
        setSubmitStatus({
          success: false,
          message:
            errorData.message ||
            "Failed to create profile. Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({
        success: false,
        message: "An error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="ml-10 mt-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">Create Your Profile</h1>
        </div>
        {/* Status message */}
        {submitStatus.message && (
          <div
            className={`p-4 mb-4 rounded-md ${submitStatus.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {submitStatus.message}
          </div>
        )}
        {/* Form */}
        <form className="ml-10" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* User Type Selection */}
            <div>
              <label
                className="mb-1 block text-lg font-medium text-gray-700"
                htmlFor="userType"
              >
                Are you a student or a startup?
              </label>
              <div className="flex flex-row gap-4">
                <div className="flex items-center">
                  <input
                    id="student"
                    name="userType"
                    type="radio"
                    value="student"
                    className="form-radio mr-2"
                    checked={userType === "student"}
                    onChange={() => setUserType("student")}
                  />
                  <label htmlFor="student" className="text-lg">
                    Student
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="startup"
                    name="userType"
                    type="radio"
                    value="startup"
                    className="form-radio mr-2"
                    checked={userType === "startup"}
                    onChange={() => setUserType("startup")}
                  />
                  <label htmlFor="startup" className="text-lg">
                    Startup
                  </label>
                </div>
              </div>
            </div>

            {/* Conditional rendering based on userType */}
            {userType === "student" && (
              // Student Form Section
              <div>
                <div className="flex flex-row">
                  <div className="mr-10">
                    <label
                      className="mb-1 block text-lg font-medium text-gray-700"
                      htmlFor="first_name"
                    >
                      First Name
                    </label>
                    <input
                      id="first_name"
                      className="form-input py-2"
                      type="text"
                      placeholder="Daniela"
                      required
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="">
                    <label
                      className="mb-1 block text-lg font-medium text-gray-700"
                      htmlFor="last_name"
                    >
                      Last Name
                    </label>
                    <input
                      id="last_name"
                      className="form-input py-2"
                      type="text"
                      placeholder="Andrade"
                      required
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="w-full">
                  <label
                    className="mb-1 block text-lg font-medium text-gray-700"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    className="form-input py-2"
                    type="email"
                    placeholder="corybarker@email.com"
                    value={user?.primaryEmailAddress?.emailAddress || ""}
                    readOnly={!!user?.primaryEmailAddress?.emailAddress}
                    required
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label
                    className="mb-1 block text-lg font-medium text-gray-700"
                    htmlFor="university"
                  >
                    University
                  </label>
                  <input
                    id="university"
                    className="form-input py-2"
                    type="text"
                    autoComplete="on"
                    placeholder=""
                    required
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label
                    className="mb-1 block text-lg font-medium text-gray-700"
                    htmlFor="linkedin_url"
                  >
                    LinkedIn URL
                  </label>
                  <input
                    id="linkedin_url"
                    className="form-input py-2"
                    type="url"
                    autoComplete="on"
                    placeholder=""
                    required
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label
                    className="mb-1 block text-lg font-medium text-gray-700"
                    htmlFor=""
                  >
                    What opportunities are you interested in?
                  </label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="flex items-center">
                      <input
                        id="Ad-hoc projects"
                        name="opportunity_interests"
                        type="checkbox"
                        value="Ad-hoc projects"
                        className="form-checkbox mr-2 h-5 w-5"
                        onChange={handleInputChange}
                      />
                      <label htmlFor="Ad-hoc projects" className="text-lg">
                        Ad-hoc projects
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="Term-time internships"
                        name="opportunity_interests"
                        type="checkbox"
                        value="Term-time internships"
                        className="form-checkbox mr-2 h-5 w-5"
                        onChange={handleInputChange}
                      />
                      <label
                        htmlFor="Term-time internships"
                        className="text-lg"
                      >
                        Term-time internships
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="Summer internships"
                        name="opportunity_interests"
                        type="checkbox"
                        value="Summer internships"
                        className="form-checkbox mr-2 h-5 w-5"
                        onChange={handleInputChange}
                      />
                      <label htmlFor="Summer internships" className="text-lg">
                        Summer internships
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="Full-time employment"
                        name="opportunity_interests"
                        type="checkbox"
                        value="Full-time employment"
                        className="form-checkbox mr-2 h-5 w-5"
                        onChange={handleInputChange}
                      />
                      <label htmlFor="Full-time employment" className="text-lg">
                        Full-time employment
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    className="mb-1 block text-lg font-medium text-gray-700"
                    htmlFor="position_interests"
                  >
                    What positions align with your interests?
                  </label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="flex items-center">
                      <input
                        id="Software Development"
                        name="position_interests"
                        type="checkbox"
                        value="Software Development"
                        className="form-checkbox mr-2 h-5 w-5"
                        onChange={handleInputChange}
                      />
                      <label htmlFor="Software Development" className="text-lg">
                        Software Development
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="Design (UI/UX, product design, etc.)"
                        name="position_interests"
                        type="checkbox"
                        value="Design (UI/UX, product design, etc.)"
                        className="form-checkbox mr-2 h-5 w-5"
                        onChange={handleInputChange}
                      />
                      <label
                        htmlFor="Design (UI/UX, product design, etc.)"
                        className="text-lg"
                      >
                        Design (UI/UX, product design, etc.)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="Marketing & Growth"
                        name="position_interests"
                        type="checkbox"
                        value="Marketing & Growth"
                        className="form-checkbox mr-2 h-5 w-5"
                        onChange={handleInputChange}
                      />
                      <label htmlFor="Marketing & Growth" className="text-lg">
                        Marketing & Growth
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="Finance / Operations"
                        name="position_interests"
                        type="checkbox"
                        value="Finance / Operations"
                        className="form-checkbox mr-2 h-5 w-5"
                        onChange={handleInputChange}
                      />
                      <label htmlFor="Finance / Operations" className="text-lg">
                        Finance / Operations
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="flex items-center">
                      <input
                        id="Product Management"
                        name="position_interests"
                        type="checkbox"
                        value="Product Management"
                        className="form-checkbox mr-2 h-5 w-5"
                        onChange={handleInputChange}
                      />
                      <label htmlFor="Product Management" className="text-lg">
                        Product Management
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="Content, Social Media, and Communications"
                        name="position_interests"
                        type="checkbox"
                        value="Content, Social Media, and Communications"
                        className="form-checkbox mr-2 h-5 w-5"
                        onChange={handleInputChange}
                      />
                      <label
                        htmlFor="Content, Social Media, and Communications"
                        className="text-lg"
                      >
                        Content, Social Media, and Communications
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="Data_Science_Analytics"
                        name="position_interests"
                        type="checkbox"
                        value="Data Science & Analytics"
                        className="form-checkbox mr-2 h-5 w-5"
                        onChange={handleInputChange}
                      />
                      <label
                        htmlFor="Data_Science_Analytics"
                        className="text-lg"
                      >
                        Data Science & Analytics
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    className="mb-1 block text-lg font-medium text-gray-700"
                    htmlFor=""
                  >
                    What areas interest you?
                  </label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="flex items-center">
                      <input
                        id="AI_Machine_Learning"
                        name="area_interests"
                        type="checkbox"
                        value="AI & Machine Learning"
                        className="form-checkbox mr-2 h-5 w-5"
                        onChange={handleInputChange}
                      />
                      <label htmlFor="AI_Machine_Learning" className="text-lg">
                        AI & Machine Learning
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="Healthcare_Biotechnology"
                        name="area_interests"
                        type="checkbox"
                        value="Healthcare & Biotechnology"
                        className="form-checkbox mr-2 h-5 w-5"
                        onChange={handleInputChange}
                      />
                      <label
                        htmlFor="Healthcare_Biotechnology"
                        className="text-lg"
                      >
                        Healthcare & Biotechnology
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="FinTech"
                        name="area_interests"
                        type="checkbox"
                        value="FinTech"
                        className="form-checkbox mr-2 h-5 w-5"
                        onChange={handleInputChange}
                      />
                      <label htmlFor="FinTech" className="text-lg">
                        FinTech
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="IT_Cybersecurity"
                        name="area_interests"
                        type="checkbox"
                        value="IT & Cybersecurity"
                        className="form-checkbox mr-2 h-5 w-5"
                        onChange={handleInputChange}
                      />
                      <label htmlFor="IT_Cybersecurity" className="text-lg">
                        IT & Cybersecurity
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="flex items-center">
                      <input
                        id="Energy_Climate_Sustainability"
                        name="area_interests"
                        type="checkbox"
                        value="Energy, Climate, and Sustainability"
                        className="form-checkbox mr-2 h-5 w-5"
                        onChange={handleInputChange}
                      />
                      <label
                        htmlFor="Energy_Climate_Sustainability"
                        className="text-lg"
                      >
                        Energy, Climate, and Sustainability
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="Education"
                        name="area_interests"
                        type="checkbox"
                        value="Education"
                        className="form-checkbox mr-2 h-5 w-5"
                        onChange={handleInputChange}
                      />
                      <label htmlFor="Education" className="text-lg">
                        Education
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="Consumer_Wellness"
                        name="area_interests"
                        type="checkbox"
                        value="Consumer & Wellness"
                        className="form-checkbox mr-2 h-5 w-5"
                        onChange={handleInputChange}
                      />
                      <label htmlFor="Consumer_Wellness" className="text-lg">
                        Consumer & Wellness
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="Legal"
                        name="area_interests"
                        type="checkbox"
                        value="Legal"
                        className="form-checkbox mr-2 h-5 w-5"
                        onChange={handleInputChange}
                      />
                      <label htmlFor="Legal" className="text-lg">
                        Legal
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-4 w-3/4">
                  <label
                    className="mb-1 block text-lg font-medium text-gray-700"
                    htmlFor="background"
                  >
                    Share more about your skills, interests, and background
                    (Optional)
                  </label>
                  <div className="">
                    <textarea
                      id="background"
                      className="form-textarea py-2 h-32 w-full"
                      placeholder="Tell us more about yourself..."
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="mt-4 w-3/4">
                  <label
                    className="mb-1 block text-lg font-medium text-gray-700"
                    htmlFor="resume"
                  >
                    Upload Your Resume
                  </label>
                  <input
                    id="resume"
                    name="resume"
                    type="file"
                    accept=".pdf, .doc, .docx"
                    className="form-input py-2"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mt-4 w-3/4">
                  <label
                    className="mb-1 block text-lg font-medium text-gray-700"
                    htmlFor="links"
                  >
                    Other Relevant Links (GitHub, portfolio, personal website,
                    Medium, etc)
                  </label>
                  <input
                    id="links"
                    name="links"
                    type="text"
                    className="form-input w-full py-2"
                    placeholder="Enter other relevant links..."
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mt-4 w-2/4">
                  <label
                    className="mb-1 block text-lg font-medium text-gray-700"
                    htmlFor="work_authorization"
                  >
                    Are you legally authorized to work in the United States?
                    (required)
                  </label>
                  <select
                    id="work_authorization"
                    name="work_authorization"
                    className="form-select py-2 w-full"
                    required
                    onChange={handleInputChange}
                  >
                    <option value="">Select an option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="mt-4 w-2/4">
                  <label
                    className="mb-1 block text-lg font-medium text-gray-700"
                    htmlFor="visa_sponsorship"
                  >
                    Will you now or in the future require sponsorship for
                    employment visa status (e.g., H-1B visa)? (required)
                  </label>
                  <select
                    id="visa_sponsorship"
                    name="visa_sponsorship"
                    className="form-select py-2 w-full"
                    required
                    onChange={handleInputChange}
                  >
                    <option value="">Select an option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="mt-4 w-full">
                  <label
                    className="mb-1 block text-lg font-medium text-gray-700"
                    htmlFor="termsAgreement"
                  >
                    I agree to the{" "}
                    <a
                      href="/terms-of-service"
                      target="_blank"
                      style={{ textDecoration: "underline" }}
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      style={{ textDecoration: "underline" }}
                    >
                      Privacy Policy
                    </a>
                  </label>
                  <input
                    id="termsAgreement"
                    name="termsAgreement"
                    type="checkbox"
                    className="form-checkbox"
                    required
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            {userType === "startup" && (
              // Startup Form Section
              <div className="p-4 border border-gray-300 rounded-md">
                <p className="text-lg text-gray-700">
                  Startup profile information will be collected here.
                </p>
              </div>
            )}
          </div>

          {userType && (
            <div className="mt-6 w-40 mb-10">
              <button
                type="submit"
                className="btn w-full bg-gradient-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow hover:bg-[length:100%_150%]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Profile"}
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
}
