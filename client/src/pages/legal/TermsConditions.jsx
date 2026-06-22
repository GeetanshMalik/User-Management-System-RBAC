import { motion } from 'framer-motion';
import { FileText, CheckCircle, XCircle, AlertTriangle, Scale, UserX } from 'lucide-react';

const TermsConditions = () => {
  const sections = [
    {
      icon: CheckCircle,
      title: 'Acceptance of Terms',
      content: `By accessing and using this User Management System, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our services.

These Terms of Service constitute a legally binding agreement between you and our organization. Your continued use of the service will be deemed as acceptance of these terms.`,
    },
    {
      icon: UserX,
      title: 'User Accounts',
      content: `Account Creation:
• You must provide accurate and complete information
• You are responsible for maintaining account security
• You must be at least 18 years old to create an account
• One person or entity may not maintain more than one account

Account Security:
• Keep your password confidential
• Notify us immediately of any unauthorized access
• You are responsible for all activities under your account
• We reserve the right to suspend accounts that violate these terms`,
    },
    {
      icon: Scale,
      title: 'Acceptable Use',
      content: `You agree to use our services only for lawful purposes. You must not:

• Violate any applicable laws or regulations
• Infringe on intellectual property rights
• Transmit malicious code or viruses
• Attempt to gain unauthorized access to systems
• Interfere with or disrupt the service
• Harass, abuse, or harm other users
• Use the service for any fraudulent purpose
• Impersonate any person or entity
• Collect user information without consent

Violation of these terms may result in immediate account termination.`,
    },
    {
      icon: FileText,
      title: 'Intellectual Property',
      content: `Service Content:
All content, features, and functionality of our service are owned by us and are protected by copyright, trademark, and other intellectual property laws.

User Content:
• You retain ownership of content you submit
• You grant us a license to use, store, and display your content
• You are responsible for the content you post
• We may remove content that violates these terms

You may not copy, modify, distribute, or create derivative works without our express written permission.`,
    },
    {
      icon: AlertTriangle,
      title: 'Limitation of Liability',
      content: `To the maximum extent permitted by law:

• The service is provided "as is" without warranties
• We are not liable for any indirect or consequential damages
• Our total liability shall not exceed the amount you paid us
• We do not guarantee uninterrupted or error-free service
• We are not responsible for third-party content or services

Some jurisdictions do not allow the exclusion of certain warranties, so some of the above exclusions may not apply to you.`,
    },
    {
      icon: XCircle,
      title: 'Termination',
      content: `Account Termination:
• You may terminate your account at any time through settings
• We may suspend or terminate your account for violations
• We may terminate service with or without notice
• Upon termination, your right to use the service ceases

Effect of Termination:
• Your data will be deleted within 30 days
• Some provisions of these terms survive termination
• You remain liable for any outstanding obligations
• We may retain certain information as required by law`,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Terms & Conditions</h1>
        <p className="text-sm text-gray-500 mt-2">Last updated: April 17, 2026</p>
        <p className="text-sm text-gray-600 mt-4 max-w-2xl mx-auto">
          Please read these Terms and Conditions carefully before using our User Management System. These
          terms govern your access to and use of our services.
        </p>
      </motion.div>

      {/* Content Sections */}
      <div className="space-y-6">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <section.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">{section.title}</h2>
                <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                  {section.content}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional Sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy and Data Protection</h2>
        <p className="text-sm text-gray-600 mb-4">
          Your use of our service is also governed by our Privacy Policy. Please review our Privacy Policy to
          understand how we collect, use, and protect your personal information.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-6">Modifications to Terms</h2>
        <p className="text-sm text-gray-600 mb-4">
          We reserve the right to modify these terms at any time. We will notify users of any material
          changes via email or through the service. Your continued use of the service after such
          modifications constitutes your acceptance of the updated terms.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-6">Governing Law</h2>
        <p className="text-sm text-gray-600 mb-4">
          These Terms shall be governed by and construed in accordance with the laws of the State of
          California, United States, without regard to its conflict of law provisions. Any disputes arising
          from these terms shall be resolved in the courts of San Francisco County, California.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-6">Dispute Resolution</h2>
        <p className="text-sm text-gray-600 mb-4">
          Any dispute arising from these terms will first be attempted to be resolved through good faith
          negotiations. If negotiations fail, disputes will be resolved through binding arbitration in
          accordance with the rules of the American Arbitration Association.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-6">Severability</h2>
        <p className="text-sm text-gray-600 mb-4">
          If any provision of these Terms is found to be unenforceable or invalid, that provision will be
          limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in
          full force and effect.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-6">Contact Information</h2>
        <p className="text-sm text-gray-600">
          If you have any questions about these Terms and Conditions, please contact us:
        </p>
        <div className="mt-4 space-y-2 text-sm">
          <p className="text-gray-600">
            <span className="font-medium">Email:</span>{' '}
            <a href="mailto:legal@management.com" className="text-indigo-600 hover:text-indigo-700">
              legal@management.com
            </a>
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Address:</span> 123 Business Street, Suite 100, San Francisco, CA
            94105
          </p>
        </div>
      </motion.div>

      {/* Acknowledgment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-indigo-50 border border-indigo-200 rounded-xl p-6"
      >
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Acknowledgment</h3>
            <p className="text-sm text-gray-600">
              By using our service, you acknowledge that you have read, understood, and agree to be bound by
              these Terms and Conditions. If you do not agree to these terms, you must discontinue use of our
              service immediately.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Back Button */}
      <div className="text-center">
        <a href="/help" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          ← Back to Help Center
        </a>
      </div>
    </div>
  );
};

export default TermsConditions;
