'use client';

import { useState } from 'react';
export const dynamic = 'force-dynamic';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');

  return (
    <div className="flex flex-col h-full w-full bg-primary p-[24px] overflow-auto">
      <div className="max-w-[900px] mx-auto w-full">
        {/* Header */}
        <div className="mb-[32px]">
          <h1 className="text-[32px] font-bold text-textColor mb-[8px]">About PostQuee</h1>
          <p className="text-[16px] text-newTextBlur">
            Review our Privacy Policy and Terms of Service
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-[16px] mb-[32px] border-b border-newBorder">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-[12px] px-[8px] text-[16px] font-medium transition-all border-b-2 ${
              activeTab === 'privacy'
                ? 'text-seventh border-seventh'
                : 'text-newTextBlur border-transparent hover:text-textColor'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`pb-[12px] px-[8px] text-[16px] font-medium transition-all border-b-2 ${
              activeTab === 'terms'
                ? 'text-seventh border-seventh'
                : 'text-newTextBlur border-transparent hover:text-textColor'
            }`}
          >
            Terms of Service
          </button>
        </div>

        {/* Content */}
        <div className="bg-newBgColorInner rounded-[16px] p-[32px] border border-newBorder">
          {activeTab === 'privacy' ? <PrivacyPolicy /> : <TermsOfService />}
        </div>
      </div>
    </div>
  );
}

function PrivacyPolicy() {
  return (
    <div className="prose prose-invert max-w-none">
      <style jsx>{`
        .prose h2 {
          color: #FF8C00;
          font-size: 24px;
          font-weight: 700;
          margin-top: 32px;
          margin-bottom: 16px;
        }
        .prose h3 {
          color: #FFF;
          font-size: 20px;
          font-weight: 600;
          margin-top: 24px;
          margin-bottom: 12px;
        }
        .prose p {
          color: #CCC;
          line-height: 1.7;
          margin-bottom: 16px;
        }
        .prose ul, .prose ol {
          color: #CCC;
          margin-bottom: 16px;
          padding-left: 24px;
        }
        .prose li {
          margin-bottom: 8px;
        }
        .prose strong {
          color: #FFF;
          font-weight: 600;
        }
        .prose a {
          color: #FF8C00;
          text-decoration: underline;
        }
        .prose a:hover {
          color: #FFA500;
        }
      `}</style>
      <p><strong>Effective Date:</strong> January 1, 2026</p>
      <p><strong>Last Updated:</strong> January 1, 2026</p>

      <h2>1. Introduction</h2>
      <p>PostQuee ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal data. This Privacy Policy explains how we collect, use, store, and protect your information when you use our social media scheduling platform ("the Service").</p>
      <p>This Privacy Policy complies with the General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA), and other applicable data protection laws. By using PostQuee, you consent to the data practices described in this policy.</p>

      <h2>2. Data Controller Information</h2>
      <p><strong>Service Provider:</strong> PostQuee<br />
      <strong>Contact Email:</strong> <a href="mailto:support@postquee.com">support@postquee.com</a><br />
      <strong>Website:</strong> <a href="https://postquee.com">https://postquee.com</a></p>

      <h2>3. Data We Collect</h2>

      <h3>3.1 Account Information</h3>
      <p>When you register for PostQuee, we collect:</p>
      <ul>
        <li><strong>Email Address:</strong> For account creation, authentication, and communication.</li>
        <li><strong>Password:</strong> Stored as a securely hashed value (we never store plaintext passwords).</li>
        <li><strong>Profile Information:</strong> Name, username, and optional profile picture.</li>
        <li><strong>Billing Information:</strong> Payment details processed securely via third-party payment processors (Stripe, PayPal). We do not store full credit card numbers.</li>
      </ul>

      <h3>3.2 Social Media Connection Data (OAuth Tokens)</h3>
      <p>When you connect your social media accounts (LinkedIn, X, Facebook, Instagram) to PostQuee, we collect and store:</p>
      <ul>
        <li><strong>OAuth Access Tokens:</strong> Encrypted authentication tokens that allow us to post content on your behalf.</li>
        <li><strong>Refresh Tokens:</strong> Used to maintain active connections to your social media accounts.</li>
        <li><strong>Account Metadata:</strong> Profile name, username, profile picture URL, and account ID from connected platforms.</li>
      </ul>
      <p><strong>Important:</strong> We never request or store your social media passwords. All connections are established through secure OAuth protocols.</p>

      <h3>3.3 Content Data</h3>
      <p>We store the content you create and schedule through PostQuee, including:</p>
      <ul>
        <li><strong>Post Text:</strong> Captions, messages, and AI-generated content drafts.</li>
        <li><strong>Media Files:</strong> Images, videos, and other media you upload for publishing.</li>
        <li><strong>Scheduling Information:</strong> Dates, times, and target platforms for scheduled posts.</li>
      </ul>

      <h2>4. How We Use Your Data</h2>
      <p>We use your data solely for the following purposes:</p>
      <ul>
        <li><strong>Service Delivery:</strong> To schedule, format, and publish your content to connected social media platforms.</li>
        <li><strong>Account Management:</strong> To create, maintain, and secure your PostQuee account.</li>
        <li><strong>AI Features:</strong> To process your content through AI models for caption generation and formatting (only when you explicitly use these features).</li>
        <li><strong>Customer Support:</strong> To respond to inquiries and provide technical assistance.</li>
      </ul>

      <h2>5. Data Sharing and Third-Party Services</h2>

      <h3>5.1 We Do NOT Sell Your Data</h3>
      <p><strong>Guarantee:</strong> We do not sell, rent, or share your personal data with third-party advertisers or data brokers.</p>

      <h3>5.2 Third-Party Service Providers</h3>
      <p>We share limited data with trusted third-party services necessary to operate PostQuee:</p>
      <ul>
        <li><strong>Cloud Hosting:</strong> For secure data storage and processing.</li>
        <li><strong>Payment Processors:</strong> Stripe, PayPal for subscription billing.</li>
        <li><strong>AI Service Providers:</strong> Only when you use AI features.</li>
      </ul>

      <h2>6. Data Security and Encryption</h2>
      <p>We implement industry-standard security measures:</p>
      <ul>
        <li><strong>Encryption in Transit:</strong> All data transmitted using TLS 1.2 or higher (HTTPS).</li>
        <li><strong>Encryption at Rest:</strong> OAuth tokens encrypted using AES-256.</li>
        <li><strong>Password Hashing:</strong> Passwords hashed using bcrypt or Argon2.</li>
      </ul>

      <h2>7. Your Privacy Rights (GDPR & CCPA)</h2>
      <p>You have the following rights:</p>
      <ul>
        <li><strong>Right to Access:</strong> Request a copy of your personal data.</li>
        <li><strong>Right to Erasure:</strong> Request complete deletion of your account.</li>
        <li><strong>Right to Data Portability:</strong> Export your data in machine-readable format.</li>
        <li><strong>Right to Withdraw Consent:</strong> Disconnect social media accounts at any time.</li>
      </ul>
      <p>Contact us at <a href="mailto:support@postquee.com">support@postquee.com</a> for any data requests.</p>

      <h2>8. Contact Us</h2>
      <p>For questions regarding this Privacy Policy or your data:</p>
      <p><strong>Email:</strong> <a href="mailto:support@postquee.com">support@postquee.com</a><br />
      <strong>Response Time:</strong> We aim to respond within 72 hours.</p>

      <p><em>By using PostQuee, you acknowledge that you have read and understood this Privacy Policy.</em></p>
    </div>
  );
}

function TermsOfService() {
  return (
    <div className="prose prose-invert max-w-none">
      <style jsx>{`
        .prose h2 {
          color: #FF8C00;
          font-size: 24px;
          font-weight: 700;
          margin-top: 32px;
          margin-bottom: 16px;
        }
        .prose h3 {
          color: #FFF;
          font-size: 20px;
          font-weight: 600;
          margin-top: 24px;
          margin-bottom: 12px;
        }
        .prose p {
          color: #CCC;
          line-height: 1.7;
          margin-bottom: 16px;
        }
        .prose ul, .prose ol {
          color: #CCC;
          margin-bottom: 16px;
          padding-left: 24px;
        }
        .prose li {
          margin-bottom: 8px;
        }
        .prose strong {
          color: #FFF;
          font-weight: 600;
        }
        .prose a {
          color: #FF8C00;
          text-decoration: underline;
        }
        .prose a:hover {
          color: #FFA500;
        }
      `}</style>
      <p><strong>Effective Date:</strong> January 1, 2026</p>

      <h2>1. Acceptance of Terms</h2>
      <p>By accessing or using PostQuee ("the Service"), you agree to be legally bound by these Terms of Service. If you do not agree, you must cease using the Service immediately.</p>

      <h2>2. Description of Service</h2>
      <p>PostQuee is a social media scheduling and automation platform that enables users to create, schedule, and publish content across multiple social networks.</p>

      <h2>3. User Responsibilities</h2>
      <p>You are solely responsible for:</p>
      <ul>
        <li><strong>Content Ownership:</strong> Ensuring you have all necessary rights to publish your content.</li>
        <li><strong>Content Legality:</strong> Ensuring your content complies with all applicable laws and platform policies.</li>
        <li><strong>Account Security:</strong> Maintaining the confidentiality of your login credentials.</li>
      </ul>

      <h2>4. AI-Generated Content Disclaimer</h2>
      <p><strong>User Responsibility:</strong> You are solely responsible for reviewing and approving all AI-generated content before publication. PostQuee is not liable for the accuracy or appropriateness of AI-generated content.</p>

      <h2>5. Third-Party Platform Liability Disclaimer</h2>
      <p><strong>Critical Notice:</strong> PostQuee is not responsible for account restrictions, suspensions, bans, or enforcement actions imposed by third-party platforms (LinkedIn, X, Facebook, Instagram) resulting from your use of automation tools or content violations.</p>

      <h2>6. "As-Is" Service Provision</h2>
      <p>PostQuee is provided on an <strong>"AS-IS" and "AS-AVAILABLE"</strong> basis without warranties of any kind. We do not guarantee uninterrupted service or successful content delivery.</p>

      <h2>7. Limitation of Liability</h2>
      <p>To the maximum extent permitted by law, PostQuee shall not be liable for any indirect, incidental, or consequential damages. Our total liability shall not exceed the amount you paid in the preceding 12 months.</p>

      <h2>8. Subscription and Payments</h2>
      <ul>
        <li><strong>Billing:</strong> Subscriptions are billed on a recurring basis.</li>
        <li><strong>Cancellation:</strong> You may cancel at any time through your account dashboard.</li>
        <li><strong>Refunds:</strong> Subscription fees are generally non-refundable.</li>
      </ul>

      <h2>9. Account Termination</h2>
      <p>We reserve the right to suspend or terminate your account if you violate these Terms or engage in fraudulent conduct.</p>

      <h2>10. Open Source License (AGPL-3.0 & GPL)</h2>

      <h3>10.1 Core Application (AGPL-3.0)</h3>
      <p>PostQuee is built upon open-source software licensed under AGPL-3.0. Source code is available at:</p>
      <p><a href="https://github.com/omribenami/PostQuee" target="_blank" rel="noopener">https://github.com/omribenami/PostQuee</a></p>

      <h3>10.2 WordPress Plugin (GPL-2.0+)</h3>
      <p>The PostQuee WordPress Plugin is licensed under GPL-2.0+. Source code is available at:</p>
      <p><a href="https://github.com/omribenami/WP_PostQuee" target="_blank" rel="noopener">https://github.com/omribenami/WP_PostQuee</a></p>

      <h2>11. Intellectual Property</h2>
      <p>You retain all rights to your content. By using the Service, you grant us a limited license to store and transmit your content for providing the Service.</p>

      <h2>12. Governing Law</h2>
      <p>These Terms shall be governed by the laws of Austin, Texas, United States.</p>

      <h2>13. Contact Information</h2>
      <p>For questions regarding these Terms:</p>
      <p><strong>Email:</strong> <a href="mailto:support@postquee.com">support@postquee.com</a><br />
      <strong>Website:</strong> <a href="https://postquee.com">https://postquee.com</a></p>

      <p><em>By using PostQuee, you acknowledge that you have read and agree to be bound by these Terms of Service.</em></p>
    </div>
  );
}
