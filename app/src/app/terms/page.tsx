import CompliancePageFooter from "../../components/compliance/compliance-page-footer";
import { Separator } from "../../components/ui/separator";

export const metadata = {
  title: "Terms of Service | Lumen AI",
  description: "Terms of Service for Lumen AI Bible App",
};

export default function TermsOfServicePage() {
  return (
    <div className="container w-full overflow-auto py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-medium">Terms of Service</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <div className="space-y-6">
          <section>
            <h2 className="mb-4 text-xl font-medium text-muted-foreground">
              1. Introduction
            </h2>
            <p className="mb-3">
              Welcome to Lumen AI (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or
              &ldquo;us&rdquo;). By accessing or using our Bible study
              application and related services (collectively, the
              &ldquo;Service&rdquo;), you agree to be bound by these Terms of
              Service (&ldquo;Terms&rdquo;). Please read them carefully.
            </p>
            <p>
              The Lumen AI application is designed to help users learn the
              stories of the Bible with the assistance of AI technology. If you
              do not agree to these Terms, please do not access or use our
              Service.
            </p>
          </section>
          <section>
            <h2 className="mb-4 text-xl font-medium text-muted-foreground">
              2. Acceptance of Terms
            </h2>
            <p className="mb-3">
              By accessing or using our Service, you represent that you are at
              least 13 years of age and agree to be bound by these Terms and our
              Privacy Policy, which is incorporated herein by reference. If you
              disagree with any part of the Terms, you may not access the
              Service.
            </p>
            <p className="mb-3">
              We reserve the right to modify these Terms at any time. We will
              provide notice of any material changes by posting the updated
              Terms on this page with a new &ldquo;Last updated&rdquo; date.
              Your continued use of the Service after such modifications will
              constitute your acknowledgment and agreement to the modified
              Terms.
            </p>
          </section>
          <section>
            <h2 className="mb-4 text-xl font-medium text-muted-foreground">
              3. User Accounts
            </h2>
            <p className="mb-3">
              When you create an account with us, you must provide accurate,
              complete, and current information. You are solely responsible for
              safeguarding your password and for all activities that occur under
              your account.
            </p>
            <p className="mb-3">
              You agree not to disclose your password to any third party. You
              must notify us immediately upon becoming aware of any breach of
              security or unauthorized use of your account at
              withlumen.ai@gmail.com.
            </p>
            <p>
              If you believe your account or information has been compromised,
              please contact us immediately at withlumen.ai@gmail.com.
            </p>
            <p className="mb-3">
              We reserve the right to suspend or terminate your account and
              refuse any and all current or future use of the Service, without
              warning, if we determine, in our sole discretion, that you have
              violated these Terms, or if we suspect fraudulent or abusive
              activity.
            </p>
          </section>
          <section>
            <h2 className="mb-4 text-xl font-medium text-muted-foreground">
              4. Content and Conduct
            </h2>
            <p className="mb-3">
              Our Service allows you to interact with AI to study Biblical
              content. You are responsible for your interactions and any content
              you submit to the Service.
            </p>
            <p className="mb-3">You agree not to use the Service to:</p>
            <ul className="mb-3 list-disc space-y-2 pl-6">
              <li>
                Violate any applicable local, state, national, or international
                law or regulation;
              </li>
              <li>
                Harass, abuse, threaten, or incite violence towards any
                individual or group;
              </li>
              <li>
                Generate or distribute content that is unlawful, defamatory,
                obscene, offensive, or otherwise objectionable;
              </li>
              <li>
                Attempt to circumvent any technological measure implemented by
                us to protect the Service;
              </li>
              <li>
                Attempt to access any other user&apos;s account or personal
                information;
              </li>
              <li>
                Use the Service for any commercial purpose without our prior
                written consent.
              </li>
            </ul>
            <p>
              We reserve the right, but are not obligated, to remove any content
              that violates these Terms or that we find objectionable for any
              reason, without prior notice.
            </p>
          </section>
          <section>
            <h2 className="mb-4 text-xl font-medium text-muted-foreground">
              5. Intellectual Property
            </h2>
            <p className="mb-3">
              The Service and its original content, features, functionality, and
              design elements are and will remain the exclusive property of
              Lumen AI and its licensors. The Service is protected by copyright,
              trademark, and other laws of both the United States and foreign
              countries. Our trademarks and trade dress may not be used in
              connection with any product or service without the prior written
              consent of Lumen AI.
            </p>
            <p className="mb-3">
              Biblical content provided through the Service is sourced from
              public domain translations or used with appropriate permissions.
              We make no claim of ownership over Biblical texts that are in the
              public domain.
            </p>
            <p>
              You retain ownership of any content you submit, post, or display
              on or through the Service. By submitting content to the Service,
              you grant us a worldwide, non-exclusive, royalty-free license
              (with the right to sublicense) to use, copy, reproduce, process,
              adapt, modify, publish, transmit, display, and distribute such
              content in any and all media or distribution methods now known or
              later developed, for the purpose of providing and improving our
              Service.
            </p>
          </section>
          <section>
            <h2 className="mb-4 text-xl font-medium text-muted-foreground">
              6. AI-Generated Content
            </h2>
            <p className="mb-3">
              Our Service utilizes AI to assist in Bible study. AI-generated
              content is provided for educational and informational purposes
              only and is not intended to serve as professional advice,
              including theological, legal, or spiritual counsel.
            </p>
            <p className="mb-3">
              We do not guarantee the accuracy, completeness, reliability, or
              suitability of AI-generated content. The AI is a tool to assist in
              understanding, not a replacement for traditional theological
              resources, academic scholarship, or clerical guidance.
            </p>
            <p className="mb-3">
              You acknowledge and agree that AI outputs may sometimes be
              incorrect, incomplete, or inappropriate. Users should exercise
              their own judgment when interpreting AI-generated responses
              related to Biblical content and should independently verify
              information for important matters.
            </p>
            <p>
              Lumen AI is not responsible for any actions you take based on
              AI-generated content, and you agree to use such content at your
              own risk.
            </p>
          </section>
          <section>
            <h2 className="mb-4 text-xl font-medium text-muted-foreground">
              7. Limitation of Liability
            </h2>
            <p className="mb-3">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT
              SHALL LUMEN AI, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS,
              SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT
              LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER
              INTANGIBLE LOSSES, RESULTING FROM (i) YOUR ACCESS TO OR USE OF OR
              INABILITY TO ACCESS OR USE THE SERVICE; (ii) ANY CONDUCT OR
              CONTENT OF ANY THIRD PARTY ON THE SERVICE; (iii) ANY CONTENT
              OBTAINED FROM THE SERVICE; AND (iv) UNAUTHORIZED ACCESS, USE, OR
              ALTERATION OF YOUR TRANSMISSIONS OR CONTENT, WHETHER BASED ON
              WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER
              LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF THE
              POSSIBILITY OF SUCH DAMAGE.
            </p>
            <p className="mb-3">
              IN JURISDICTIONS WHERE THE EXCLUSION OR LIMITATION OF LIABILITY
              FOR CONSEQUENTIAL OR INCIDENTAL DAMAGES IS NOT ALLOWED, OUR
              LIABILITY SHALL BE LIMITED TO THE MAXIMUM EXTENT PERMITTED BY LAW.
            </p>
          </section>
          <section>
            <h2 className="mb-4 text-xl font-medium text-muted-foreground">
              8. Disclaimer of Warranties
            </h2>
            <p className="mb-3">
              THE SERVICE IS PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS
              AVAILABLE&rdquo; BASIS. LUMEN AI EXPRESSLY DISCLAIMS ALL
              WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT
              NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS
              FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p className="mb-3">
              LUMEN AI MAKES NO WARRANTY THAT (i) THE SERVICE WILL MEET YOUR
              REQUIREMENTS; (ii) THE SERVICE WILL BE UNINTERRUPTED, TIMELY,
              SECURE, OR ERROR-FREE; (iii) THE RESULTS THAT MAY BE OBTAINED FROM
              THE USE OF THE SERVICE WILL BE ACCURATE OR RELIABLE; OR (iv) ANY
              ERRORS IN THE SERVICE WILL BE CORRECTED.
            </p>
          </section>
          withlumen.ai@gmail.com
          <section>
            <h2 className="mb-4 text-xl font-medium text-muted-foreground">
              9. Indemnification
            </h2>
            <p className="mb-3">
              You agree to defend, indemnify, and hold harmless Lumen AI and its
              licensors, service providers, employees, agents, officers, and
              directors from and against any claims, liabilities, damages,
              judgments, awards, losses, costs, expenses, or fees (including
              reasonable attorneys&apos; fees) arising out of or relating to
              your violation of these Terms or your use of the Service,
              including, but not limited to, your User Content and any use of
              the Service&apos;s content, services, and products other than as
              expressly authorized in these Terms.
            </p>
          </section>
          <section>
            <h2 className="mb-4 text-xl font-medium text-muted-foreground">
              10. Termination
            </h2>
            <p className="mb-3">
              We may terminate or suspend your account and bar access to the
              Service immediately, without prior notice or liability, under our
              sole discretion, for any reason whatsoever, including but not
              limited to a breach of the Terms.
            </p>
            <p className="mb-3">
              If you wish to terminate your account, you may simply discontinue
              using the Service or contact us to request account deletion. All
              provisions of the Terms which by their nature should survive
              termination shall survive termination, including, without
              limitation, ownership provisions, warranty disclaimers, indemnity,
              and limitations of liability.
            </p>
          </section>
          <section>
            <h2 className="mb-4 text-xl font-medium text-muted-foreground">
              11. Governing Law
            </h2>
            <p className="mb-3">
              These Terms shall be governed and construed in accordance with the
              laws of the United States, without regard to its conflict of law
              provisions. Our failure to enforce any right or provision of these
              Terms will not be considered a waiver of those rights. If any
              provision of these Terms is held to be invalid or unenforceable by
              a court, the remaining provisions of these Terms will remain in
              effect.
            </p>
          </section>
          <section>
            <h2 className="mb-4 text-xl font-medium text-muted-foreground">
              12. Changes to Terms
            </h2>
            <p className="mb-3">
              We reserve the right to modify or replace these Terms at any time
              at our sole discretion. If a revision is material, we will provide
              at least 30 days&apos; notice prior to any new terms taking
              effect. What constitutes a material change will be determined at
              our sole discretion.
            </p>
            <p>
              By continuing to access or use our Service after any revisions
              become effective, you agree to be bound by the revised terms. If
              you do not agree to the new terms, you are no longer authorized to
              use the Service.
            </p>
          </section>
          <p>
            If you have any questions about these Terms, please contact us at
            withlumen.ai@gmail.com.
          </p>
          <Separator />
          <CompliancePageFooter />
        </div>
      </div>
    </div>
  );
}
