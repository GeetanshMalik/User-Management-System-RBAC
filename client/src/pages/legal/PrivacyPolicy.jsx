import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: FileText,
      title: 'Information We Collect',
      content: `We collect information you provide directly to us, including:
      
• Personal information (name, email address, phone number)
• Account credentials and authentication data
• Profile information and preferences
• Usage data and activity logs
• Device and browser information
• Communication records

We collect this information when you create an account, use our services, or communicate with us.`,
    },
    {
      icon: Database,
      title: 'How We Use Your Information',
      content: `We use the information we collect to:

• Provide, maintain, and improve our services
• Process your requests and transactions
• Send you technical notices and support messages
• Communicate with you about products, services, and events
• Monitor and analyze trends, usage, and activities
• Detect, prevent, and address technical issues
• Protect against fraud and unauthorized access
• Comply with legal obligations`,
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: `We take security seriously and implement appropriate measures to protect your information:

• 256-bit SSL/TLS encryption for data in transit
• AES-256 encryption for data at rest
• Regular security audits and penetration testing
• Multi-factor authentication options
• Access controls and authentication mechanisms
• Regular backups and disaster recovery procedures
• Employee training on data protection

However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.`,
    },
    {
      icon: Eye,
      title: 'Information Sharing',
      content: `We do not sell your personal information. We may share your information only in the following circumstances:

• With your consent or at your direction
• With service providers who perform services on our behalf
• To comply with legal obligations or respond to legal requests
• To protect our rights, privacy, safety, or property
• In connection with a merger, acquisition, or sale of assets
• With other users when you choose to share information publicly

All third parties are required to maintain the confidentiality of your information.`,
    },
    {
      icon: UserCheck,
      title: 'Your Rights and Choices',
      content: `You have the following rights regarding your personal information:

• Access: Request a copy of your personal data
• Correction: Update or correct inaccurate information
• Deletion: Request deletion of your account and data
• Portability: Receive your data in a portable format
• Opt-out: Unsubscribe from marketing communications
• Restriction: Limit how we process your information

To exercise these rights, contact us at privacy@management.com or through your account settings.`,
    },
    {
      icon: Shield,
      title: 'Data Retention',
      content: `We retain your information for as long as necessary to:

• Provide our services to you
• Comply with legal obligations
• Resolve disputes and enforce agreements
• Maintain security and prevent fraud

When you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain it for legal purposes.

Activity logs are retained for 90 days for security and audit purposes.`,
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
          <Shield className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mt-2">Last updated: April 17, 2026</p>
        <p className="text-sm text-gray-600 mt-4 max-w-2xl mx-auto">
          Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and
          safeguard your information when you use our User Management System.
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

      {/* Additional Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Children's Privacy</h2>
        <p className="text-sm text-gray-600 mb-4">
          Our services are not intended for children under 13 years of age. We do not knowingly collect
          personal information from children under 13. If you are a parent or guardian and believe your child
          has provided us with personal information, please contact us.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-6">International Data Transfers</h2>
        <p className="text-sm text-gray-600 mb-4">
          Your information may be transferred to and processed in countries other than your country of
          residence. These countries may have data protection laws that are different from the laws of your
          country. We ensure appropriate safeguards are in place to protect your information.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-6">Changes to This Policy</h2>
        <p className="text-sm text-gray-600 mb-4">
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting
          the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review
          this Privacy Policy periodically for any changes.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-6">Contact Us</h2>
        <p className="text-sm text-gray-600">
          If you have any questions about this Privacy Policy, please contact us:
        </p>
        <div className="mt-4 space-y-2 text-sm">
          <p className="text-gray-600">
            <span className="font-medium">Email:</span>{' '}
            <a href="mailto:privacy@management.com" className="text-indigo-600 hover:text-indigo-700">
              privacy@management.com
            </a>
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Address:</span> 123 Business Street, Suite 100, San Francisco, CA
            94105
          </p>
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

export default PrivacyPolicy;
