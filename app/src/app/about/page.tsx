import InformationPageSection from "../../components/information/information-page-section";
import InformationPageWrapper from "../../components/information/information-page-wrapper";
import InformationPageSectionParagraph from "../../components/information/information-page-section-paragraph";

export const metadata = {
  title: "About | Lumen",
  description:
    "About Lumen Bible App - Experiencing God's Word in the Digital Age",
};

export default function AboutPage() {
  return (
    <InformationPageWrapper
      title="Lumen"
      description="Deepening Your Relationship with God Through Scripture"
      lastUpdated="April 19, 2025"
    >
      <InformationPageSection title="Our Mission">
        <InformationPageSectionParagraph className="leading-relaxed">
          We created Lumen with a conviction that God&apos;s boundless love and
          grace should be accessible to everyone in today&apos;s digital world.
          In a time when technology shapes how we learn and connect, we believe
          the transformative message of Scripture—God&apos;s sovereign plan for
          humanity&apos;s redemption—deserves the best tools we can create.
        </InformationPageSectionParagraph>
        <InformationPageSectionParagraph className="leading-relaxed" isLast>
          We&apos;re passionate about helping people know Jesus more deeply,
          experience God&apos;s unconditional love, and build authentic
          relationships rooted in His grace. The timeless wisdom of Scripture
          deserves a place at the forefront of technological innovation.
        </InformationPageSectionParagraph>
      </InformationPageSection>
      <InformationPageSection title="Our Guiding Convictions">
        <InformationPageSectionParagraph className="leading-relaxed" isLast>
          We firmly believe that Scripture reveals God&apos;s love story with
          humanity—a testament to His sovereignty and grace that transforms
          lives from the inside out. The Bible isn&apos;t merely information;
          it&apos;s revelation from a loving God who pursues relationship with
          His people. We&apos;re convinced that growing in faith means growing
          in knowledge of God&apos;s Word, where we encounter His character in
          all its fullness. Many believers hunger for deeper understanding of
          Scripture&apos;s rich treasures, and we&apos;re committed to creating
          technology that makes studying God&apos;s Word more rewarding,
          accessible, and life-changing than ever before.
        </InformationPageSectionParagraph>
      </InformationPageSection>
      <InformationPageSection title="Technology in Service of Faith">
        <InformationPageSectionParagraph className="leading-relaxed">
          Throughout history, God has used human innovation to spread His
          message—from scrolls to printing presses to digital platforms. We
          believe AI represents the next frontier in making God&apos;s Word
          accessible to all. We see technology as complementing and amplifying
          the invaluable role of human teachers, helping to bring seminary-level
          insights to everyday believers in partnership with pastors, teachers,
          and mentors. Lumen is built with reverence for how God&apos;s
          sovereignty works through human creativity and community.
        </InformationPageSectionParagraph>
        <InformationPageSectionParagraph className="leading-relaxed">
          Our AI approach isn&apos;t just about efficiency—it&apos;s about
          helping you experience the depths of God&apos;s wisdom, love, and
          grace in Scripture in ways that speak directly to your questions,
          struggles, and journey of faith.
        </InformationPageSectionParagraph>
        <InformationPageSectionParagraph className="leading-relaxed" isLast>
          In alignment with our belief that God&apos;s Word should be freely
          accessible to all, we&apos;re committed to making Lumen open source.
          By sharing our codebase with the public, we invite the broader
          community to collaborate in developing tools that help people engage
          more deeply with Scripture. This approach reflects the essence of the
          gospel itself—freely given, freely shared.
        </InformationPageSectionParagraph>
      </InformationPageSection>
      <InformationPageSection title="Our Distinct Perspective">
        <InformationPageSectionParagraph className="leading-relaxed" isLast>
          Lumen is designed specifically to honor the Bible&apos;s divine
          inspiration while embracing human questions. Unlike generic AI, our
          approach recognizes Scripture&apos;s authority and unique nature—its
          unified story of God&apos;s redemptive love spanning diverse books and
          contexts. We&apos;ve created a companion for your spiritual journey
          that respects the Bible&apos;s richness and helps you wrestle with
          challenging passages in light of God&apos;s character and purposes. By
          combining cutting-edge technology with time-tested wisdom, we&apos;ve
          built a tool that doesn&apos;t just provide answers but helps you grow
          in relationship with the God who is sovereign over all of history,
          including our technological age.
        </InformationPageSectionParagraph>
      </InformationPageSection>
    </InformationPageWrapper>
  );
}
