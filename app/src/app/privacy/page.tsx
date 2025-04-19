import CompliancePageFooter from "../../components/compliance/compliance-page-footer";
import { Separator } from "../../components/ui/separator";

export const metadata = {
  title: "Privacy Policy | Lumen AI",
  description: "Privacy Policy for Lumen AI Bible App",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container w-full overflow-auto py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-medium">Privacy Policy</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <div className="space-y-6">
          <section>
            <h2 className="mb-4 text-xl font-medium text-muted-foreground">
              1. Introduction
            </h2>
            <p className="mb-3">
              At Lumen AI (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or
              &ldquo;us&rdquo;), we respect your privacy and are committed to
              protecting your personal data. This Privacy Policy explains how we
              collect, use, store, protect, and share your information when you
              use our Bible study application and related services
              (collectively, the &ldquo;Service&rdquo;).
            </p>
            <p className="mb-3">
              This Privacy Policy applies to all users of our Service,
              regardless of how they access or use it. By using our Service, you
              acknowledge that you have read and understood this Privacy Policy
              and our Terms of Service.
            </p>
            <p>
              If you do not agree with our policies and practices, please do not
              use our Service. If you have any questions or concerns, please
              contact us using the information provided in the &ldquo;Contact
              Us&rdquo; section.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-medium text-muted-foreground">
              2. Information We Collect
            </h2>
            <p className="mb-3">
              We collect several types of information from and about users of
              our Service, including:
            </p>
            <ul className="mb-3 list-disc space-y-2 pl-6">
              <li>
                <span className="font-medium">Personal Information:</span> Such
                as your name, email address, username, profile information, and
                authentication data when you register for an account.
              </li>
              <li>
                <span className="font-medium">Usage Data:</span> Information
                about how you use our Service, including your interaction with
                the Bible study content and AI features, time spent on the
                Service, pages visited, features used, and other actions taken
                within the Service.
              </li>
              <li>
                <span className="font-medium">Study Content:</span> Information
                about your Bible study preferences, notes, highlights,
                bookmarks, and any user-generated content you create or share
                through the Service.
              </li>
              <li>
                <span className="font-medium">Technical Data:</span> Internet
                protocol (IP) address, browser type and version, device
                information (type, model, operating system), time zone setting,
                language preferences, mobile device identifiers, and analytics
                data.
              </li>
              <li>
                <span className="font-medium">Communications:</span> When you
                contact us directly, we may collect and store your
                communications and the information you provide.
              </li>
              <li>
                <span className="font-medium">
                  Cookies and Similar Technologies:
                </span>{" "}
                We use cookies and similar tracking technologies to track
                activity on our Service and hold certain information. See our
                &ldquo;Cookies and Tracking Technologies&rdquo; section for more
                details.
              </li>
            </ul>
            <p className="mb-3">
              We collect this information directly from you when you provide it
              to us, automatically as you navigate through the Service, and from
              third parties, such as our authentication and analytics providers.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-medium text-muted-foreground">
              3. How We Use Your Information
            </h2>
            <p className="mb-3">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="mb-3 list-disc space-y-2 pl-6">
              <li>Providing, maintaining, and improving our Service;</li>
              <li>
                Personalizing your experience and recommending relevant content;
              </li>
              <li>
                Processing account registration, authentication, and account
                maintenance;
              </li>
              <li>
                Communicating with you about updates, features, support, or
                other Service-related notifications;
              </li>
              <li>
                Analyzing usage patterns and trends to enhance our Service;
              </li>
              <li>Training and improving our AI models;</li>
              <li>
                Ensuring the security, integrity, and optimal performance of our
                Service;
              </li>
              <li>
                Troubleshooting technical issues and responding to support
                requests;
              </li>
              <li>
                Complying with legal obligations and enforcing our Terms of
                Service;
              </li>
              <li>
                Protecting against, identifying, and preventing fraud and other
                illegal activities;
              </li>
              <li>
                With your consent, sending updates about our Service that may
                interest you.
              </li>
            </ul>
            <p className="mb-3">
              We process your information for these purposes based on one or
              more of the following legal grounds:
            </p>
            <ul className="mb-3 list-disc space-y-2 pl-6">
              <li>
                To fulfill our contractual obligations to you under our Terms of
                Service;
              </li>
              <li>Where you have given us consent;</li>
              <li>
                For our legitimate interests, which do not override your
                fundamental rights and freedoms;
              </li>
              <li>To comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-medium text-muted-foreground">
              4. AI Data Processing
            </h2>
            <p className="mb-3">
              Our Service utilizes AI to assist in Bible study. When you
              interact with our AI features:
            </p>
            <ul className="mb-3 list-disc space-y-2 pl-6">
              <li>
                We process your questions, prompts, and interactions to provide
                relevant, personalized responses;
              </li>
              <li>
                We may use anonymized and aggregated interactions to train,
                test, and improve our AI models;
              </li>
              <li>
                We implement technical and organizational safeguards to protect
                sensitive information shared with our AI systems;
              </li>
              <li>
                AI-generated content and analysis are created specifically for
                your use and learning;
              </li>
              <li>
                We retain your AI interaction history to provide personalized
                experiences and improve our Service.
              </li>
            </ul>
            <p className="mb-3">
              You have control over your AI interaction history and can delete
              it from your account settings. However, aggregated and anonymized
              data may be retained for service improvement purposes.
            </p>
            <p>
              We do not use your AI interactions to make automated decisions
              that would have legal or similarly significant effects on you
              without appropriate safeguards and consent.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-medium text-muted-foreground">
              5. Cookies and Tracking Technologies
            </h2>
            <p className="mb-3">
              We use cookies, web beacons, and similar tracking technologies to
              collect information about your browsing activities and to
              distinguish you from other users of our Service. These
              technologies help us improve our Service by allowing us to:
            </p>
            <ul className="mb-3 list-disc space-y-2 pl-6">
              <li>Remember your preferences and settings;</li>
              <li>Understand how you use our Service;</li>
              <li>Analyze trends and gather aggregate data;</li>
              <li>Provide secure authentication;</li>
              <li>Measure the effectiveness of our features.</li>
            </ul>
            <p className="mb-3">
              We use both session cookies (which expire when you close your
              browser) and persistent cookies (which remain on your device until
              you delete them or they expire).
            </p>
            <p className="mb-3">
              You can control cookies through your browser settings and other
              tools. However, if you block certain cookies, you may not be able
              to register, log in, or access certain parts of our Service.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-medium text-muted-foreground">
              6. Data Sharing and Disclosure
            </h2>
            <p className="mb-3">
              We do not sell your personal information. We may share your
              information in the following circumstances:
            </p>
            <ul className="mb-3 list-disc space-y-2 pl-6">
              <li>
                <span className="font-medium">Service Providers:</span> With
                third-party vendors, consultants, and other service providers
                who need access to your information to perform services on our
                behalf, such as hosting, analytics, customer service, and fraud
                prevention. These service providers are contractually obligated
                to use your information only for the purposes for which we
                disclose it to them.
              </li>
              <li>
                <span className="font-medium">Legal Compliance:</span> When
                required by law, court order, or governmental regulation, or
                when we believe in good faith that disclosure is necessary to
                protect our rights, protect your safety or the safety of others,
                investigate fraud, or respond to a government request.
              </li>
              <li>
                <span className="font-medium">Consent:</span> With your explicit
                consent or at your direction.
              </li>
              <li>
                <span className="font-medium">Business Transfers:</span> In
                connection with a corporate transaction, such as a merger,
                acquisition, asset sale, or in the unlikely event of bankruptcy,
                where your information may be transferred as a business asset.
              </li>
              <li>
                <span className="font-medium">Affiliates:</span> With our parent
                company, subsidiaries, and affiliates for purposes consistent
                with this Privacy Policy.
              </li>
            </ul>
            <p className="mb-3">
              We may also share aggregated, anonymized, or de-identified
              information, which cannot reasonably be used to identify you, with
              third parties for research, marketing, analytics, and other
              purposes.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-medium text-muted-foreground">
              7. Data Security
            </h2>
            <p className="mb-3">
              We implement appropriate technical and organizational security
              measures to protect your personal information from unauthorized
              access, alteration, disclosure, or destruction. These measures
              include:
            </p>
            <ul className="mb-3 list-disc space-y-2 pl-6">
              <li>Encryption of sensitive data;</li>
              <li>Secure authentication procedures;</li>
              <li>Regular security assessments;</li>
              <li>Limited access to personal information by employees;</li>
              <li>Physical and electronic safeguards.</li>
            </ul>
            <p className="mb-3">
              However, no method of transmission over the Internet or electronic
              storage is 100% secure. While we strive to use commercially
              acceptable means to protect your personal information, we cannot
              guarantee its absolute security.
            </p>
            <p>
              If you believe your account or information has been compromised,
              please contact us immediately at withlumen.ai@gmail.com.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-medium text-muted-foreground">
              8. Data Retention
            </h2>
            <p className="mb-3">
              We retain your personal information for as long as necessary to
              fulfill the purposes outlined in this Privacy Policy, unless a
              longer retention period is required or permitted by law. The
              criteria used to determine our retention periods include:
            </p>
            <ul className="mb-3 list-disc space-y-2 pl-6">
              <li>
                The length of time we have an ongoing relationship with you;
              </li>
              <li>Our legal obligations;</li>
              <li>
                Whether retention is advisable considering our legal position
                (such as for statutes of limitations, litigation, or regulatory
                investigations).
              </li>
            </ul>
            <p>
              When we no longer need to use your personal information, we will
              either delete it or anonymize it so that it can no longer be
              associated with you. In some cases, we may retain certain
              information in anonymized or aggregated form.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-medium text-muted-foreground">
              9. Your Privacy Rights
            </h2>
            <p className="mb-3">
              Depending on your location, you may have certain rights regarding
              your personal information, including:
            </p>
            <ul className="mb-3 list-disc space-y-2 pl-6">
              <li>
                <span className="font-medium">Access:</span> The right to
                request a copy of your personal information that we hold.
              </li>
              <li>
                <span className="font-medium">Correction:</span> The right to
                request correction of your personal information if it is
                inaccurate or incomplete.
              </li>
              <li>
                <span className="font-medium">Deletion:</span> The right to
                request that we delete your personal information in certain
                circumstances.
              </li>
              <li>
                <span className="font-medium">Restriction:</span> The right to
                request that we restrict the processing of your personal
                information in certain circumstances.
              </li>
              <li>
                <span className="font-medium">Objection:</span> The right to
                object to our processing of your personal information in certain
                circumstances.
              </li>
              <li>
                <span className="font-medium">Portability:</span> The right to
                receive your personal information in a structured, commonly
                used, and machine-readable format.
              </li>
              <li>
                <span className="font-medium">Consent Withdrawal:</span> The
                right to withdraw your consent at any time where we rely on
                consent to process your personal information.
              </li>
            </ul>
            <p className="mb-3">
              To exercise these rights, please contact us using the information
              in the &ldquo;Contact Us&rdquo; section. We will respond to your
              request within the timeframe required by applicable law.
            </p>
            <p className="mb-3">
              Please note that these rights may be limited in some circumstances
              by applicable law, and we may need to verify your identity before
              responding to your request.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-medium text-muted-foreground">
              10. International Data Transfers
            </h2>
            <p className="mb-3">
              Your personal information may be transferred to, stored, and
              processed in countries other than the country in which you reside.
              These countries may have data protection laws that are different
              from the laws of your country.
            </p>
            <p className="mb-3">
              When we transfer your personal information to other countries, we
              take appropriate safeguards to ensure that your personal
              information receives an adequate level of protection. These
              safeguards may include:
            </p>
            <ul className="mb-3 list-disc space-y-2 pl-6">
              <li>
                Using specific contracts approved by relevant authorities that
                give personal information the same protection it has in your
                country;
              </li>
              <li>
                Implementing appropriate technical and organizational measures
                to protect your information;
              </li>
              <li>
                Transferring only to countries that have been recognized as
                providing an adequate level of legal protection.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-medium text-muted-foreground">
              11. Children&apos;s Privacy
            </h2>
            <p className="mb-3">
              Our Service is not intended for children under the age of 13. We
              do not knowingly collect personal information from children under
              13. If we become aware that we have collected personal information
              from a child under 13 without verification of parental consent, we
              will take steps to delete that information.
            </p>
            <p className="mb-3">
              If you are a parent or guardian and you believe your child has
              provided us with personal information without your consent, please
              contact us. If we learn that we have collected personal
              information from a child without verification of parental consent,
              we&apos;ll take steps to remove that information from our servers.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-medium text-muted-foreground">
              12. Third-Party Links and Services
            </h2>
            <p className="mb-3">
              Our Service may contain links to third-party websites, services,
              or applications that are not owned or controlled by Lumen AI. This
              Privacy Policy applies only to our Service. We have no control
              over and assume no responsibility for the content, privacy
              policies, or practices of any third-party services.
            </p>
            <p>
              We encourage you to review the privacy policies of any third-party
              services that you access from our Service.
            </p>
          </section>
          <section>
            <h2 className="mb-4 text-xl font-medium text-muted-foreground">
              13. Changes to This Privacy Policy
            </h2>
            <p className="mb-3">
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and, if the changes are significant, we will provide a more
              prominent notice, such as an email notification.
            </p>
            <p className="mb-3">
              You are advised to review this Privacy Policy periodically for any
              changes. Changes to this Privacy Policy are effective when they
              are posted on this page. The date the Privacy Policy was last
              revised is identified at the top of the page.
            </p>
            <p>
              Your continued use of the Service after the posting of changes
              constitutes your acceptance of such changes.
            </p>
          </section>
          <section>
            <h2 className="mb-4 text-xl font-medium text-muted-foreground">
              14. Contact Us
            </h2>
            <p className="mb-3">
              If you have any questions, concerns, or requests regarding this
              Privacy Policy or our privacy practices, please contact us at:
              withlumen.ai@gmail.com
            </p>
          </section>
          <Separator />
          <CompliancePageFooter />
        </div>
      </div>
    </div>
  );
}
