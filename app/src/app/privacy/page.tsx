import InformationPageSection from "../../components/information/information-page-section";
import InformationPageWrapper from "../../components/information/information-page-wrapper";
import InformationPageSectionParagraph from "../../components/information/information-page-section-paragraph";
import InformationPageSectionList, {
  InformationPageSectionListItem,
  InformationPageSectionListItemLabel,
} from "../../components/information/information-page-section-list";

export const metadata = {
  title: "Privacy Policy | Lumen",
  description: "Privacy Policy for Lumen Bible App",
};

export default function PrivacyPolicyPage() {
  return (
    <InformationPageWrapper title="Privacy Policy" lastUpdated="April 19, 2025">
      <InformationPageSection title="1. Introduction">
        <InformationPageSectionParagraph>
          At Lumen (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;),
          we respect your privacy and are committed to protecting your personal
          data. This Privacy Policy explains how we collect, use, store,
          protect, and share your information when you use our Bible study
          application and related services (collectively, the
          &ldquo;Service&rdquo;).
        </InformationPageSectionParagraph>
        <InformationPageSectionParagraph>
          This Privacy Policy applies to all users of our Service, regardless of
          how they access or use it. By using our Service, you acknowledge that
          you have read and understood this Privacy Policy and our Terms of
          Service.
        </InformationPageSectionParagraph>
        <InformationPageSectionParagraph isLast>
          If you do not agree with our policies and practices, please do not use
          our Service. If you have any questions or concerns, please contact us
          using the information provided in the &ldquo;Contact Us&rdquo;
          section.
        </InformationPageSectionParagraph>
      </InformationPageSection>
      <InformationPageSection title="2. Information We Collect">
        <InformationPageSectionParagraph>
          We collect several types of information from and about users of our
          Service, including:
        </InformationPageSectionParagraph>
        <InformationPageSectionList>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Personal Information:
            </InformationPageSectionListItemLabel>{" "}
            Such as your name, email address, username, profile information, and
            authentication data when you register for an account.
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Usage Data:
            </InformationPageSectionListItemLabel>{" "}
            Information about how you use our Service, including your
            interaction with the Bible study content and AI features, time spent
            on the Service, pages visited, features used, and other actions
            taken within the Service.
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Study Content:
            </InformationPageSectionListItemLabel>{" "}
            Information about your Bible study preferences, notes, highlights,
            bookmarks, and any user-generated content you create or share
            through the Service.
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Technical Data:
            </InformationPageSectionListItemLabel>{" "}
            Internet protocol (IP) address, browser type and version, device
            information (type, model, operating system), time zone setting,
            language preferences, mobile device identifiers, and analytics data.
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Communications:
            </InformationPageSectionListItemLabel>{" "}
            When you contact us directly, we may collect and store your
            communications and the information you provide.
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Cookies and Similar Technologies:
            </InformationPageSectionListItemLabel>{" "}
            We use cookies and similar tracking technologies to track activity
            on our Service and hold certain information. See our &ldquo;Cookies
            and Tracking Technologies&rdquo; section for more details.
          </InformationPageSectionListItem>
        </InformationPageSectionList>
        <InformationPageSectionParagraph isLast>
          We collect this information directly from you when you provide it to
          us, automatically as you navigate through the Service, and from third
          parties, such as our authentication and analytics providers.
        </InformationPageSectionParagraph>
      </InformationPageSection>
      <InformationPageSection title="3. How We Use Your Information">
        <InformationPageSectionParagraph>
          We use the information we collect for various purposes, including:
        </InformationPageSectionParagraph>
        <InformationPageSectionList>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Providing, maintaining, and improving our Service;
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Personalizing your experience and recommending relevant content;
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Processing account registration, authentication, and account
              maintenance;
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Communicating with you about updates, features, support, or other
              Service-related notifications;
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Analyzing usage patterns and trends to enhance our Service;
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Training and improving our AI models;
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Ensuring the security, integrity, and optimal performance of our
              Service;
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Troubleshooting technical issues and responding to support
              requests;
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Complying with legal obligations and enforcing our Terms of
              Service;
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Protecting against, identifying, and preventing fraud and other
              illegal activities;
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              With your consent, sending updates about our Service that may
              interest you.
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
        </InformationPageSectionList>
        <InformationPageSectionParagraph>
          We process your information for these purposes based on one or more of
          the following legal grounds:
        </InformationPageSectionParagraph>
        <InformationPageSectionList>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              To fulfill our contractual obligations to you under our Terms of
              Service;
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Where you have given us consent;
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              For our legitimate interests, which do not override your
              fundamental rights and freedoms;
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              To comply with legal obligations.
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
        </InformationPageSectionList>
      </InformationPageSection>

      <InformationPageSection title="4. AI Data Processing">
        <InformationPageSectionParagraph>
          Our Service utilizes AI to assist in Bible study. When you interact
          with our AI features:
        </InformationPageSectionParagraph>
        <InformationPageSectionList>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              We process your questions, prompts, and interactions to provide
              relevant, personalized responses;
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              We may use anonymized and aggregated interactions to train, test,
              and improve our AI models;
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              We implement technical and organizational safeguards to protect
              sensitive information shared with our AI systems;
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              AI-generated content and analysis are created specifically for
              your use and learning;
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              We retain your AI interaction history to provide personalized
              experiences and improve our Service.
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
        </InformationPageSectionList>
        <InformationPageSectionParagraph>
          You have control over your AI interaction history and can delete it
          from your account settings. However, aggregated and anonymized data
          may be retained for service improvement purposes.
        </InformationPageSectionParagraph>
        <InformationPageSectionParagraph>
          We do not use your AI interactions to make automated decisions that
          would have legal or similarly significant effects on you without
          appropriate safeguards and consent.
        </InformationPageSectionParagraph>
      </InformationPageSection>

      <InformationPageSection title="5. Cookies and Tracking Technologies">
        <InformationPageSectionParagraph>
          We use cookies, web beacons, and similar tracking technologies to
          collect information about your browsing activities and to distinguish
          you from other users of our Service. These technologies help us
          improve our Service by allowing us to:
        </InformationPageSectionParagraph>
        <InformationPageSectionList>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Remember your preferences and settings;
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Understand how you use our Service;
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Analyze trends and gather aggregate data;
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Provide secure authentication;
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Measure the effectiveness of our features.
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
        </InformationPageSectionList>
        <InformationPageSectionParagraph>
          We use both session cookies (which expire when you close your browser)
          and persistent cookies (which remain on your device until you delete
          them or they expire).
        </InformationPageSectionParagraph>
        <InformationPageSectionParagraph>
          You can control cookies through your browser settings and other tools.
          However, if you block certain cookies, you may not be able to
          register, log in, or access certain parts of our Service.
        </InformationPageSectionParagraph>
      </InformationPageSection>
      <InformationPageSection title="6. Data Sharing and Disclosure">
        <InformationPageSectionParagraph>
          We do not sell your personal information. We may share your
          information in the following circumstances:
        </InformationPageSectionParagraph>
        <InformationPageSectionList>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Service Providers:
            </InformationPageSectionListItemLabel>{" "}
            With third-party vendors, consultants, and other service providers
            who need access to your information to perform services on our
            behalf, such as hosting, analytics, customer service, and fraud
            prevention. These service providers are contractually obligated to
            use your information only for the purposes for which we disclose it
            to them.
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Legal Compliance:
            </InformationPageSectionListItemLabel>{" "}
            When required by law, court order, or governmental regulation, or
            when we believe in good faith that disclosure is necessary to
            protect our rights, protect your safety or the safety of others,
            investigate fraud, or respond to a government request.
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Consent:
            </InformationPageSectionListItemLabel>{" "}
            With your explicit consent or at your direction.
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Business Transfers:
            </InformationPageSectionListItemLabel>{" "}
            In connection with a corporate transaction, such as a merger,
            acquisition, asset sale, or in the unlikely event of bankruptcy,
            where your information may be transferred as a business asset.
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Affiliates:
            </InformationPageSectionListItemLabel>{" "}
            With our parent company, subsidiaries, and affiliates for purposes
            consistent with this Privacy Policy.
          </InformationPageSectionListItem>
        </InformationPageSectionList>
        <InformationPageSectionParagraph>
          We may also share aggregated, anonymized, or de-identified
          information, which cannot reasonably be used to identify you, with
          third parties for research, marketing, analytics, and other purposes.
        </InformationPageSectionParagraph>
      </InformationPageSection>

      <InformationPageSection title="7. Data Security">
        <InformationPageSectionParagraph>
          We implement appropriate technical and organizational security
          measures to protect your personal information from unauthorized
          access, alteration, disclosure, or destruction. These measures
          include:
        </InformationPageSectionParagraph>
        <InformationPageSectionList>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Encryption of sensitive data;
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Secure authentication procedures;
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Regular security assessments;
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Limited access to personal information by employees;
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Physical and electronic safeguards.
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
        </InformationPageSectionList>
        <InformationPageSectionParagraph>
          However, no method of transmission over the Internet or electronic
          storage is 100% secure. While we strive to use commercially acceptable
          means to protect your personal information, we cannot guarantee its
          absolute security.
        </InformationPageSectionParagraph>
        <InformationPageSectionParagraph>
          If you believe your account or information has been compromised,
          please contact us immediately at withlumen.ai@gmail.com.
        </InformationPageSectionParagraph>
      </InformationPageSection>

      <InformationPageSection title="8. Data Retention">
        <InformationPageSectionParagraph>
          We retain your personal information for as long as necessary to
          fulfill the purposes outlined in this Privacy Policy, unless a longer
          retention period is required or permitted by law. The criteria used to
          determine our retention periods include:
        </InformationPageSectionParagraph>
        <InformationPageSectionList>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              The length of time we have an ongoing relationship with you;
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Our legal obligations;
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Whether retention is advisable considering our legal position
              (such as for statutes of limitations, litigation, or regulatory
              investigations).
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
        </InformationPageSectionList>
        <InformationPageSectionParagraph>
          When we no longer need to use your personal information, we will
          either delete it or anonymize it so that it can no longer be
          associated with you. In some cases, we may retain certain information
          in anonymized or aggregated form.
        </InformationPageSectionParagraph>
      </InformationPageSection>

      <InformationPageSection title="9. Your Privacy Rights">
        <InformationPageSectionParagraph>
          Depending on your location, you may have certain rights regarding your
          personal information, including:
        </InformationPageSectionParagraph>
        <InformationPageSectionList>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Access:
            </InformationPageSectionListItemLabel>{" "}
            The right to request a copy of your personal information that we
            hold.
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Correction:
            </InformationPageSectionListItemLabel>{" "}
            The right to request correction of your personal information if it
            is inaccurate or incomplete.
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Deletion:
            </InformationPageSectionListItemLabel>{" "}
            The right to request that we delete your personal information in
            certain circumstances.
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Restriction:
            </InformationPageSectionListItemLabel>{" "}
            The right to request that we restrict the processing of your
            personal information in certain circumstances.
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Objection:
            </InformationPageSectionListItemLabel>{" "}
            The right to object to our processing of your personal information
            in certain circumstances.
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Portability:
            </InformationPageSectionListItemLabel>{" "}
            The right to receive your personal information in a structured,
            commonly used, and machine-readable format.
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Consent Withdrawal:
            </InformationPageSectionListItemLabel>{" "}
            The right to withdraw your consent at any time where we rely on
            consent to process your personal information.
          </InformationPageSectionListItem>
        </InformationPageSectionList>
        <InformationPageSectionParagraph>
          To exercise these rights, please contact us using the information in
          the &ldquo;Contact Us&rdquo; section. We will respond to your request
          within the timeframe required by applicable law.
        </InformationPageSectionParagraph>
        <InformationPageSectionParagraph>
          Please note that these rights may be limited in some circumstances by
          applicable law, and we may need to verify your identity before
          responding to your request.
        </InformationPageSectionParagraph>
      </InformationPageSection>

      <InformationPageSection title="10. International Data Transfers">
        <InformationPageSectionParagraph>
          Your personal information may be transferred to, stored, and processed
          in countries other than the country in which you reside. These
          countries may have data protection laws that are different from the
          laws of your country.
        </InformationPageSectionParagraph>
        <InformationPageSectionParagraph>
          When we transfer your personal information to other countries, we take
          appropriate safeguards to ensure that your personal information
          receives an adequate level of protection. These safeguards may
          include:
        </InformationPageSectionParagraph>
        <InformationPageSectionList>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Using specific contracts approved by relevant authorities that
              give personal information the same protection it has in your
              country;
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Implementing appropriate technical and organizational measures to
              protect your information;
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
          <InformationPageSectionListItem>
            <InformationPageSectionListItemLabel>
              Transferring only to countries that have been recognized as
              providing an adequate level of legal protection.
            </InformationPageSectionListItemLabel>
          </InformationPageSectionListItem>
        </InformationPageSectionList>
      </InformationPageSection>
      <InformationPageSection title="11. Children's Privacy">
        <InformationPageSectionParagraph>
          Our Service is not intended for children under the age of 13. We do
          not knowingly collect personal information from children under 13. If
          we become aware that we have collected personal information from a
          child under 13 without verification of parental consent, we will take
          steps to delete that information.
        </InformationPageSectionParagraph>
        <InformationPageSectionParagraph>
          If you are a parent or guardian and you believe your child has
          provided us with personal information without your consent, please
          contact us. If we learn that we have collected personal information
          from a child without verification of parental consent, we&apos;ll take
          steps to remove that information from our servers.
        </InformationPageSectionParagraph>
      </InformationPageSection>

      <InformationPageSection title="12. Third-Party Links and Services">
        <InformationPageSectionParagraph>
          Our Service may contain links to third-party websites, services, or
          applications that are not owned or controlled by Lumen. This Privacy
          Policy applies only to our Service. We have no control over and assume
          no responsibility for the content, privacy policies, or practices of
          any third-party services.
        </InformationPageSectionParagraph>
        <InformationPageSectionParagraph>
          We encourage you to review the privacy policies of any third-party
          services that you access from our Service.
        </InformationPageSectionParagraph>
      </InformationPageSection>
      <InformationPageSection title="13. Changes to This Privacy Policy">
        <InformationPageSectionParagraph>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page and, if
          the changes are significant, we will provide a more prominent notice,
          such as an email notification.
        </InformationPageSectionParagraph>
        <InformationPageSectionParagraph>
          You are advised to review this Privacy Policy periodically for any
          changes. Changes to this Privacy Policy are effective when they are
          posted on this page. The date the Privacy Policy was last revised is
          identified at the top of the page.
        </InformationPageSectionParagraph>
        <InformationPageSectionParagraph>
          Your continued use of the Service after the posting of changes
          constitutes your acceptance of such changes.
        </InformationPageSectionParagraph>
      </InformationPageSection>
      <InformationPageSection title="14. Contact Us">
        <InformationPageSectionParagraph isLast>
          If you have any questions, concerns, or requests regarding this
          Privacy Policy or our privacy practices, please contact us at:
          withlumen.ai@gmail.com
        </InformationPageSectionParagraph>
      </InformationPageSection>
    </InformationPageWrapper>
  );
}
