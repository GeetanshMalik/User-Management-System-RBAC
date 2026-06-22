import { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Search, Mail, Phone, MapPin, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'How do I reset my password?',
      answer: 'Go to your profile settings, click on "Security" section, and select "Change Password". You\'ll need to enter your current password and then your new password twice to confirm.',
    },
    {
      id: 2,
      question: 'How can I update my profile information?',
      answer: 'Navigate to "My Profile" from the user menu in the top right corner. You can edit your personal information, contact details, and upload a profile picture.',
    },
    {
      id: 3,
      question: 'What are the different user roles?',
      answer: 'There are three main roles: Admin (full system access), Manager (can manage users and view reports), and User (basic access to personal profile). Check the Roles & Permissions page for detailed information.',
    },
    {
      id: 4,
      question: 'How do I create a new user account?',
      answer: 'Only Admins can create new user accounts. Go to User Directory, click "Create New User", fill in the required information, and assign the appropriate role.',
    },
    {
      id: 5,
      question: 'Can I export activity logs?',
      answer: 'Yes, Admins and Managers can export activity logs. Go to Activity Logs page and click the "Export Logs" button to download a CSV file.',
    },
    {
      id: 6,
      question: 'How do I disable or delete my account?',
      answer: 'Go to Settings > Danger Zone. You can temporarily disable your account or permanently delete it. Note that account deletion cannot be undone.',
    },
    {
      id: 7,
      question: 'What notifications will I receive?',
      answer: 'You can customize your notification preferences in Settings. Options include email notifications, push notifications, activity alerts, and weekly reports.',
    },
    {
      id: 8,
      question: 'How do I change the theme?',
      answer: 'Go to Settings > Appearance and select your preferred theme (Light or Dark mode). The change will be applied immediately.',
    },
  ];

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email Support',
      value: 'support@management.com',
      description: 'We typically respond within 24 hours',
    },
    {
      icon: Phone,
      label: 'Phone Support',
      value: '+1 (555) 123-4567',
      description: 'Mon-Fri, 9AM-6PM EST',
    },
    {
      icon: MapPin,
      label: 'Office Address',
      value: '123 Business Street, Suite 100',
      description: 'San Francisco, CA 94105',
    },
  ];

  const teamMembers = [
    {
      name: 'John Smith',
      role: 'System Administrator',
      email: 'john.smith@management.com',
      avatar: 'JS',
    },
    {
      name: 'Sarah Johnson',
      role: 'Technical Support Lead',
      email: 'sarah.johnson@management.com',
      avatar: 'SJ',
    },
    {
      name: 'Michael Chen',
      role: 'Security Manager',
      email: 'michael.chen@management.com',
      avatar: 'MC',
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
        <p className="text-sm text-gray-500 mt-1">Find answers and get support</p>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
          />
        </div>
      </motion.div>

      {/* FAQs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-left font-medium text-gray-900">{faq.question}</span>
                {expandedFaq === faq.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {expandedFaq === faq.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-4 text-sm text-gray-600 border-t border-gray-100"
                >
                  <p className="pt-4">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Contact Us</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactInfo.map((contact, index) => (
            <motion.div
              key={contact.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <contact.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">{contact.label}</p>
                  <p className="text-sm text-indigo-600 font-medium mb-1">{contact.value}</p>
                  <p className="text-xs text-gray-500">{contact.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Support Team */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Our Support Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.email}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                {member.avatar}
              </div>
              <h3 className="font-semibold text-gray-900">{member.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{member.role}</p>
              <a
                href={`mailto:${member.email}`}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                {member.email}
              </a>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-indigo-50 border border-indigo-200 rounded-xl p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a
            href="/privacy"
            className="px-4 py-3 bg-white rounded-lg hover:shadow-md transition-shadow text-sm font-medium text-gray-900"
          >
            Privacy Policy →
          </a>
          <a
            href="/terms"
            className="px-4 py-3 bg-white rounded-lg hover:shadow-md transition-shadow text-sm font-medium text-gray-900"
          >
            Terms & Conditions →
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default HelpCenter;
