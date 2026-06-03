import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface Guide {
  slug: string
  title: string
  description: string
  content: string
  faqs: { q: string; a: string }[]
}

const GUIDES: Guide[] = [
  {
    slug: 'what-is-direct-primary-care',
    title: 'What Is Direct Primary Care? The Complete Patient Guide',
    description: 'Direct Primary Care (DPC) is a healthcare model where patients pay a flat monthly fee directly to their doctor — no insurance, no copays, unlimited visits. Here\'s everything patients need to know.',
    content: `
      <h2>The Basic Idea</h2>
      <p>Direct Primary Care (DPC) is a membership-based model for primary care. Instead of running every visit through your health insurance, you pay your doctor directly — a flat monthly fee that covers unlimited primary care. The physician's office makes money from memberships, not from billing insurance for each visit.</p>
      <p>The result: your doctor sees far fewer patients (usually 300–600 instead of the 2,500–3,000 typical of an insurance-based practice), has time to actually talk with you, answers texts and calls directly, offers same-day or next-day visits, and gets paid to keep you healthy — not to see you as often as possible.</p>

      <h2>What DPC Typically Covers</h2>
      <p>The exact services included in a DPC membership vary by practice, but most DPC physicians include:</p>
      <ul>
        <li>Unlimited office visits with no copay</li>
        <li>Same-day or next-day appointments</li>
        <li>Direct phone, text, and email access to your doctor</li>
        <li>Annual wellness exams and preventive care</li>
        <li>Acute care (illness, injury, infections)</li>
        <li>Chronic disease management (diabetes, hypertension, thyroid, etc.)</li>
        <li>Basic in-office procedures (wound care, skin biopsies, joint injections)</li>
        <li>Medication management and prescriptions</li>
        <li>Telehealth visits included in membership</li>
        <li>Lab work at wholesale prices (often 80–95% below retail)</li>
      </ul>
      <p>What DPC does <strong>not</strong> cover: hospitalizations, surgeries, specialist visits, emergency room care, imaging (though many DPC practices negotiate wholesale radiology rates). Most patients pair DPC with a low-cost catastrophic insurance plan or health sharing plan for these needs.</p>

      <h2>What Does DPC Cost?</h2>
      <p>Adult memberships typically range from $50 to $150 per month. Family plans run $150–$300/month for a household. Some practices charge less for younger, healthier patients and more for older patients with complex conditions. Children's memberships are often $15–$50/month.</p>
      <p>Compare this to the average American HDHP premium: $600–$900/month for individual coverage (often with a $3,000–$6,000 deductible on top). Many patients save money by combining DPC ($75–$100/month) with a catastrophic-only or health sharing plan ($200–$400/month) — total spend is often $275–$500/month, versus $600–$900+ for traditional insurance where they're still paying copays and deductibles when they use care.</p>

      <h2>Who Is DPC Right For?</h2>
      <p>DPC works best for patients who:</p>
      <ul>
        <li>Are on a high-deductible health plan and rarely hit their deductible (paying full price for primary care anyway)</li>
        <li>Are self-employed with no employer-sponsored insurance</li>
        <li>Use primary care regularly — the math improves significantly if you see your doctor 4+ times a year</li>
        <li>Want same-day access and a doctor who actually knows them</li>
        <li>Have chronic conditions requiring frequent primary care touchpoints (DPC is often extraordinarily cost-effective here)</li>
        <li>Value prevention and want a doctor with time to work through health goals, not rush through a 7-minute visit</li>
      </ul>

      <h2>How to Find a DPC Practice</h2>
      <p>Use our directory to search for DPC practices by city, state, or specialty. Look for practices that are accepting new patients, offer telehealth if that matters to you, and see the age ranges served — some DPC physicians are adults-only, others see pediatric patients. Many DPC practices offer a free meet-and-greet visit so you can determine fit before signing up.</p>
    `,
    faqs: [
      {
        q: 'Is Direct Primary Care the same as concierge medicine?',
        a: 'No. DPC and concierge medicine are often confused but are different models. DPC practices charge $50–$150/month and don\'t bill insurance at all for primary care. Concierge practices charge $150–$300+/month but typically continue billing insurance on top of the retainer fee. DPC is the more affordable option and the only one where insurance is completely removed from the primary care relationship.',
      },
      {
        q: 'Do I still need health insurance if I join a DPC practice?',
        a: 'Yes, for anything beyond primary care. DPC covers your ongoing primary care relationship but doesn\'t cover hospitalizations, surgeries, specialist visits, or emergency care. Most DPC patients pair their membership with a low-cost catastrophic plan, a high-deductible plan, or a health sharing arrangement like Sedera or Zion HealthShare for these needs.',
      },
      {
        q: 'Can I use my HSA to pay for DPC membership?',
        a: 'Yes. DPC membership fees are HSA-eligible under provisions in the SECURE Act 2.0 and confirmed in the 2025 "Big Beautiful Bill." Using pre-tax HSA dollars effectively reduces your DPC membership cost by 20–35% depending on your tax bracket.',
      },
      {
        q: 'How many patients does a DPC doctor see?',
        a: 'Most DPC physicians intentionally cap their patient panel at 300–600 patients (compared to 2,500–3,000 in a typical insurance-based practice). This smaller panel is what enables same-day appointments, direct physician access, and unhurried 30–60 minute visits.',
      },
    ],
  },
  {
    slug: 'dpc-vs-concierge-medicine',
    title: 'DPC vs. Concierge Medicine: What\'s the Real Difference?',
    description: 'Direct Primary Care and concierge medicine look similar on the surface — both charge a monthly fee for enhanced doctor access. But they work very differently. Here\'s what every patient should know before choosing.',
    content: `
      <h2>The Confusion Is Real — Here's Why</h2>
      <p>Both Direct Primary Care and concierge medicine charge patients a periodic membership fee in exchange for better access to their physician. Both promise same-day appointments, direct phone access, and longer visits. This surface similarity leads many patients — and even some journalists — to treat them as synonyms. They're not.</p>

      <h2>The Core Difference: Insurance</h2>
      <p>The defining difference comes down to insurance billing. DPC physicians have walked away from insurance entirely for primary care. Concierge physicians usually haven't.</p>
      <p><strong>DPC:</strong> The physician does not bill insurance for primary care visits, labs drawn in-office, or procedures included in the membership. Revenue comes 100% from membership fees. The physician is free from insurance contracts, preauthorizations, and billing overhead.</p>
      <p><strong>Concierge:</strong> The physician charges a retainer fee (often $150–$300+/month) in addition to continuing to bill insurance for covered services. You pay the retainer AND your insurance premiums AND whatever cost-sharing your plan requires for each visit.</p>

      <h2>What This Means for Your Wallet</h2>
      <p>For patients, the financial math works differently:</p>
      <ul>
        <li><strong>DPC patient:</strong> Pays $75/month membership + low-cost catastrophic plan (~$200–$350/month). Total primary care is fully covered by membership. No copays for primary care visits.</li>
        <li><strong>Concierge patient:</strong> Pays $200/month retainer + full health insurance premium ($600–$900+/month for an individual). When you visit, your insurance copay or deductible still applies on top of the retainer.</li>
      </ul>
      <p>DPC is almost always the more affordable option for patients who want direct physician access. The concierge model doubles up on costs; DPC replaces the insurance-gated primary care relationship with a direct one.</p>

      <h2>Why Some Physicians Choose Concierge Instead of DPC</h2>
      <p>Concierge medicine lets physicians add a retainer revenue stream without fundamentally changing their business model. They keep insurance contracts, keep their existing infrastructure, and simply layer a fee on top. DPC requires a more radical shift: dropping insurance contracts, rebuilding the practice around memberships, and often reducing patient panel size significantly. For established physicians with existing insurance-based practices, the DPC transition is operationally harder.</p>

      <h2>Which Is Right for You?</h2>
      <p>If you have health insurance that you're keeping regardless and you want enhanced access within your existing coverage, concierge might make sense — though the added cost is significant. If you're self-employed, uninsured, on a HDHP, or philosophically opposed to insurance-gated primary care, DPC is almost certainly the better fit. It delivers similar or better access at a lower total cost when combined with a catastrophic or health sharing plan.</p>
    `,
    faqs: [
      {
        q: 'Is concierge medicine more expensive than DPC?',
        a: 'For most patients, yes. Concierge practices charge $150–$300+/month AND you still pay full health insurance premiums. DPC charges $50–$150/month and you pair it with a low-cost catastrophic or health sharing plan. Total out-of-pocket is usually lower with DPC than with concierge medicine.',
      },
      {
        q: 'Do DPC practices bill insurance at all?',
        a: 'No, for primary care. DPC practices are deliberately outside the insurance system for primary care services. They do not file insurance claims for office visits, basic labs, or covered procedures. Some DPC practices will bill insurance for specific items they order externally (like imaging ordered to a hospital), but the primary care relationship itself is entirely fee-for-membership.',
      },
      {
        q: 'Can I search for DPC practices specifically (not concierge) in your directory?',
        a: 'Yes. All practices listed in DirectPrimaryCareFinder.com are DPC practices that operate on a flat monthly membership model without insurance billing for primary care. We do not list traditional concierge practices.',
      },
    ],
  },
  {
    slug: 'direct-primary-care-hsa',
    title: 'Direct Primary Care + HSA: How to Pay for DPC With Pre-Tax Dollars',
    description: 'DPC membership fees are HSA-eligible. Pairing a DPC practice with a Health Savings Account is one of the smartest healthcare financial moves available to self-employed patients and small business owners.',
    content: `
      <h2>The Quick Answer</h2>
      <p>Yes, you can use your Health Savings Account (HSA) to pay for Direct Primary Care membership fees. DPC memberships qualify as a qualified medical expense under IRS guidelines, and this eligibility was reinforced by provisions in the SECURE Act 2.0 and most recently confirmed in the 2025 "Big Beautiful Bill" healthcare legislation.</p>

      <h2>Why This Combination Is So Powerful</h2>
      <p>HSAs are triple tax-advantaged: contributions go in pre-tax, they grow tax-free, and withdrawals for qualified medical expenses are tax-free. Using your HSA to pay for DPC membership effectively reduces your cost by your marginal tax rate.</p>
      <p>Example for someone in the 22% federal tax bracket:</p>
      <ul>
        <li>DPC membership: $100/month → $1,200/year</li>
        <li>After HSA tax savings: ~$936/year effective cost (22% savings)</li>
        <li>State income tax savings add another 5–10% reduction depending on your state</li>
        <li>Net result: A $100/month membership can effectively cost $65–$78/month after tax savings</li>
      </ul>

      <h2>The Optimal Setup: DPC + HDHP + HSA</h2>
      <p>The most common DPC pairing for self-employed patients and small business owners:</p>
      <ul>
        <li><strong>DPC membership:</strong> $50–$150/month — covers all primary care, direct physician access, basic labs at wholesale prices</li>
        <li><strong>High-Deductible Health Plan (HDHP):</strong> $200–$400/month — catastrophic coverage for hospitalizations, surgeries, emergencies</li>
        <li><strong>HSA contributions:</strong> Use pre-tax dollars to pay DPC membership AND cover your HDHP deductible if needed</li>
      </ul>
      <p>This structure gives you full primary care coverage (DPC), catastrophic coverage (HDHP), and a tax-advantaged account (HSA) — all for $250–$550/month total, often significantly less than traditional insurance with copays and deductibles.</p>

      <h2>Health Sharing Plans as an Alternative to HDHPs</h2>
      <p>Some DPC patients opt for health sharing plans (Sedera, Zion HealthShare, Liberty HealthShare) instead of HDHPs. Health sharing plans are typically not insurance, so they don't qualify you for HSA contributions. However, they often cost less per month and may have lower incident deductibles than HDHPs. The tradeoff: no HSA benefit, but potentially lower monthly cost. Both approaches work well with DPC.</p>

      <h2>Key Tax Considerations</h2>
      <p>To use an HSA, you must be enrolled in an HSA-qualified High-Deductible Health Plan (HDHP) — health sharing plans do not qualify. For 2025, the maximum HSA contribution is $4,300 for individuals and $8,550 for families (plus a $1,000 catch-up contribution if you're 55+). Self-employed individuals can also deduct 100% of health insurance premiums from income tax — a further reduction in effective healthcare cost.</p>

      <h2>How to Start</h2>
      <p>Find a DPC practice in your area using our directory, confirm their monthly membership fee, and calculate your annual DPC cost. Set up an HSA with a provider like Fidelity HSA, Lively, or HealthEquity and contribute at least the amount of your annual DPC membership cost. Pay your DPC membership from your HSA each month. Keep receipts — the DPC practice can provide invoices. Consult your tax advisor for specifics, as HSA rules can change and your situation may vary.</p>
    `,
    faqs: [
      {
        q: 'Is DPC membership an HSA-qualified medical expense?',
        a: 'Yes. DPC membership fees are a qualified medical expense for HSA purposes under IRS guidelines. Provisions in the SECURE Act 2.0 and the 2025 healthcare legislation have reinforced this eligibility. Keep your DPC membership invoices for tax records.',
      },
      {
        q: 'Can I use an HSA if I have a health sharing plan instead of insurance?',
        a: 'No. HSAs require enrollment in an IRS-qualified High-Deductible Health Plan (HDHP). Health sharing plans are not HDHPs, so they do not qualify you to open or contribute to an HSA. You can still use DPC with a health sharing plan — you just won\'t get the HSA tax benefit.',
      },
      {
        q: 'What is the best HSA account for DPC patients?',
        a: 'For straightforward DPC membership payments, Fidelity HSA and Lively are popular choices — both have no monthly fees and easy bill-pay setups. If you plan to invest your HSA funds for long-term growth, Fidelity offers a wider investment selection. Check that your chosen provider allows direct payment to your DPC practice.',
      },
      {
        q: 'How much can I save using an HSA for DPC?',
        a: 'It depends on your marginal tax rate. In the 22% bracket, using HSA dollars for a $100/month DPC membership saves you $264/year in federal taxes alone. Add state income tax savings (varies 0–13% by state) and you might save $300–$450/year on a $1,200 annual DPC membership. Higher earners in the 32%+ bracket save proportionally more.',
      },
    ],
  },
  {
    slug: 'is-dpc-right-for-me',
    title: 'Is Direct Primary Care Right for You? 5 Questions to Ask',
    description: 'Not everyone benefits equally from switching to Direct Primary Care. These five questions will help you decide whether DPC makes sense for your health situation, finances, and lifestyle.',
    content: `
      <h2>DPC Isn't for Everyone — But It's Right for More People Than You'd Expect</h2>
      <p>Direct Primary Care has genuine, life-changing appeal for a specific patient profile. For others, it's a poor fit given their insurance situation or health needs. These five questions cut through the marketing to help you figure out where you land.</p>

      <h2>Question 1: How Often Do You Actually See Your Primary Care Doctor?</h2>
      <p>DPC's value proposition strengthens with usage. If you see a doctor zero to one time per year, the math is harder to justify compared to paying per-visit fees. But if you manage a chronic condition, have kids who need regular sick visits, or proactively use preventive care — you're visiting four, six, ten or more times a year. At that usage level, DPC's flat fee is almost always cheaper than per-visit insurance copays, and you get same-day access every time.</p>
      <p><strong>Good fit signal:</strong> You use primary care regularly or want to — but currently delay or avoid it because of cost, wait times, or hassle.</p>

      <h2>Question 2: What Does Your Insurance Currently Look Like?</h2>
      <p>If your employer pays most of your insurance premium and you have low copays, DPC adds cost rather than replacing it. But if you're self-employed, on a marketplace HDHP, or paying $600+/month for insurance with a $3,000+ deductible — you're essentially already paying full price for primary care out of pocket. DPC replaces that with a predictable monthly fee and no deductible.</p>
      <p><strong>Good fit signal:</strong> You're self-employed, a freelancer, small business owner, 1099 contractor, or your employer HDHP has a deductible you rarely or never hit.</p>

      <h2>Question 3: How Important Is Direct Physician Access?</h2>
      <p>Standard primary care practices accept thousands of patients. Getting a same-day appointment when you're sick is often impossible. Reaching your doctor by phone requires navigating a phone tree to speak to a nurse who may or may not pass a message. DPC practices cap panels at 300–600 patients and give patients their physician's direct number. If you've ever missed work for a visit you could have resolved over the phone, or waited a week to see your doctor for something acute, DPC directly solves that problem.</p>
      <p><strong>Good fit signal:</strong> You've been frustrated by wait times, rushed visits, or inability to reach your doctor when you have a time-sensitive question.</p>

      <h2>Question 4: Do You Have Complex Chronic Conditions?</h2>
      <p>DPC is exceptional for chronic disease management. Patients managing diabetes, hypertension, thyroid disease, chronic pain, or autoimmune conditions typically need frequent touchpoints with their primary care physician. Under insurance-based care, each touchpoint is a copay or deductible hit. Under DPC, frequent communication is included. Many DPC physicians proactively contact patients between visits to check labs, adjust medications, or address symptoms — because they have the time and financial incentive to keep patients healthy.</p>
      <p><strong>Good fit signal:</strong> You have one or more chronic conditions requiring ongoing management and regular lab monitoring.</p>

      <h2>Question 5: Are You Comfortable Managing Your Own Insurance Strategy?</h2>
      <p>DPC requires taking ownership of your overall healthcare coverage. You need to separately arrange insurance or a health sharing plan for emergencies and hospitalizations. This isn't complex, but it is a conscious choice most employer-insured patients never have to make. If you prefer to have a single plan that handles everything — even if it costs more — DPC requires more active engagement than traditional insurance. If you enjoy understanding your options and optimizing for cost, DPC rewards that engagement significantly.</p>
      <p><strong>Good fit signal:</strong> You're financially literate, health-engaged, and willing to manage a simple two-part coverage setup (DPC + catastrophic plan).</p>

      <h2>What to Do Next</h2>
      <p>If two or more of these questions point toward DPC, it's worth exploring. Find a DPC practice in your area using our directory. Most DPC practices offer a free consultation or meet-and-greet visit — use it to understand their specific services, pricing, panel availability, and how they handle specialist referrals. Switching to DPC is not irreversible: you can return to traditional insurance-based primary care if it's not the right fit.</p>
    `,
    faqs: [
      {
        q: 'What if I get seriously ill — does DPC cover hospitalizations?',
        a: 'No. DPC covers primary care. For hospitalizations, surgeries, specialist visits, and emergency care, you need health insurance or a health sharing plan. DPC physicians will help coordinate your specialist care, manage your medications, and do pre/post-hospital follow-up visits — all within your membership. But the hospital and specialist bills go through whatever coverage you maintain separately.',
      },
      {
        q: 'Can I use DPC if I have Medicare?',
        a: 'Yes, with a caveat. DPC practices can see Medicare patients, but Medicare regulations currently limit how DPC-Medicare arrangements work. Some DPC practices require Medicare patients to sign an opt-out agreement acknowledging that Medicare won\'t be billed for their DPC services. Contact the specific DPC practice in our directory about their Medicare policy before signing up.',
      },
      {
        q: 'Is there a contract or can I cancel my DPC membership anytime?',
        a: 'Most DPC practices offer month-to-month memberships with 30 days notice to cancel. Some offer annual memberships at a slight discount. Unlike insurance, there\'s no open enrollment window — you can join or leave when it makes sense for you. Read the specific practice\'s membership agreement before signing.',
      },
    ],
  },
  {
    slug: 'how-to-switch-to-direct-primary-care',
    title: 'How to Switch From Traditional Insurance to Direct Primary Care',
    description: 'Switching to DPC doesn\'t mean going uninsured. Here\'s a practical, step-by-step guide to transitioning from traditional insurance-based primary care to a DPC membership without gaps in coverage or care.',
    content: `
      <h2>The Good News: Switching Is Simpler Than It Sounds</h2>
      <p>Many patients assume switching to DPC is complicated or risky. It's neither. The transition takes a few weeks and mainly involves: finding a DPC practice, arranging separate catastrophic coverage, and leaving your old primary care relationship. Here's how to do it without stress or coverage gaps.</p>

      <h2>Step 1: Find a DPC Practice That's Accepting New Patients</h2>
      <p>Start with our directory. Search your city or state and look for practices marked as accepting new patients. Many DPC practices offer a free new-patient consultation — schedule one before committing. Ask about: membership pricing for your age and situation, what's included in the flat fee, how they handle specialist referrals, their typical patient load and availability, whether they offer telehealth as part of membership, and their cancellation policy.</p>
      <p>Some DPC practices have waitlists — plan 2–4 weeks ahead if you're in a market where DPC is popular (Denver, Austin, Nashville, Kansas City, Seattle).</p>

      <h2>Step 2: Arrange Catastrophic or Secondary Coverage</h2>
      <p>Before canceling or not renewing your existing health insurance, set up your backup coverage. Your options:</p>
      <ul>
        <li><strong>High-Deductible Health Plan (HDHP):</strong> Qualifies you for HSA contributions. Available on healthcare.gov marketplace or directly through insurers. Compare total annual maximum out-of-pocket costs, not just premiums.</li>
        <li><strong>Health Sharing Plan:</strong> Not insurance, but a cost-sharing arrangement among members. Sedera, Zion HealthShare, Liberty HealthShare, and Knew Health are popular options that explicitly support DPC pairing. Often lower monthly cost than HDHPs but no HSA benefit and more out-of-pocket variability for large incidents.</li>
        <li><strong>Short-term health plan:</strong> A backup option for the self-employed in transition, though limited in what they cover.</li>
      </ul>
      <p>If you're self-employed: your health insurance premiums are 100% deductible from income tax. Factor this into your total cost comparison.</p>

      <h2>Step 3: Enroll in DPC</h2>
      <p>Once you've confirmed catastrophic coverage, sign up with your chosen DPC practice. Most practices collect a first month's membership fee and may ask for a simple health questionnaire. You'll receive your physician's direct contact information — this is the point where DPC starts paying off: you now have a doctor you can text when you have a question, without making an appointment.</p>

      <h2>Step 4: Transfer Your Medical Records</h2>
      <p>Request your medical records from your old primary care practice. Under HIPAA, you have a right to your records within 30 days of request (many practices provide them sooner). You can have them sent directly to your new DPC physician or keep a copy for yourself. Key records to transfer: medication lists, lab history, chronic condition notes, vaccination records, any specialist visit summaries.</p>

      <h2>Step 5: Let Go of Your Old Primary Care Relationship</h2>
      <p>You don't need to formally "fire" your old doctor, but if you have ongoing prescriptions or pending referrals, coordinate their completion before fully transitioning. Your DPC physician can take over prescription management after your first visit. Plan for a 30–60 minute onboarding visit with your new DPC doctor to establish your baseline and care plan.</p>

      <h2>Common First-Month Experiences</h2>
      <p>Most DPC members report noticing the difference immediately: their doctor responds to messages same-day, appointments happen within 24 hours, and they stop dreading calling the doctor's office. For patients with chronic conditions, the first few months often involve a medication review and lab panel — your DPC physician wants to understand your full health picture, not just react to acute visits.</p>
    `,
    faqs: [
      {
        q: 'Can I switch to DPC mid-year if I\'m already enrolled in insurance?',
        a: 'Yes. Joining a DPC practice doesn\'t affect your existing insurance enrollment. You can join DPC any time and decide whether to drop, change, or keep your insurance at the next open enrollment or qualifying life event. Many people start DPC membership while keeping existing insurance, then reassess at renewal.',
      },
      {
        q: 'What happens if I need a specialist while on DPC?',
        a: 'Your DPC physician handles the referral — this is included in your membership. They\'ll help identify the right specialist, write a referral letter, and coordinate your care. Specialist visits themselves are billed through your insurance or health sharing plan, not your DPC membership. Your DPC doctor remains your care coordinator throughout specialist visits.',
      },
      {
        q: 'What if I move to another city — can I keep my DPC practice?',
        a: 'Many DPC practices offer telehealth as part of the membership, which can work for routine follow-ups if you relocate. However, if you move permanently, you\'ll likely want to find a new DPC practice in your city. Most DPC practices require patients to be within a reasonable geographic range for in-person visits. Our directory makes it easy to find a DPC practice in any new city.',
      },
      {
        q: 'How long should I give DPC before deciding if it\'s working?',
        a: 'At least three months. The first month involves setup: new patient visit, records transfer, establishing your care plan. By month three, you\'ll have a baseline with your physician and understand the rhythm of DPC — direct messaging, same-day visits, proactive check-ins. Most patients who cancel DPC do so in month one before experiencing what a mature DPC relationship actually looks like.',
      },
    ],
  },
]

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return GUIDES.map(g => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const guide = GUIDES.find(g => g.slug === slug)
  if (!guide) return {}

  return {
    title: `${guide.title} | DirectPrimaryCareFinder.com`,
    description: guide.description,
    alternates: { canonical: `https://www.directprimarycarefinder.com/guides/${slug}` },
  }
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params
  const guide = GUIDES.find(g => g.slug === slug)
  if (!guide) notFound()

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    publisher: {
      '@type': 'Organization',
      name: 'DirectPrimaryCareFinder.com',
      url: 'https://www.directprimarycarefinder.com',
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="flex items-center gap-1 text-xs font-body text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-teal transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" aria-hidden />
          <Link href="/listings" className="hover:text-brand-teal transition-colors">Find DPC Practices</Link>
          <ChevronRight className="w-3 h-3" aria-hidden />
          <span className="text-gray-700">Guide</span>
        </nav>

        {/* Header */}
        <h1 className="font-display text-brand-navy text-3xl font-bold mb-4 leading-tight">
          {guide.title}
        </h1>
        <p className="font-body text-gray-500 text-base mb-8 border-b border-surface-border pb-6">
          {guide.description}
        </p>

        {/* Article body */}
        <div
          className="prose-guide mb-10"
          dangerouslySetInnerHTML={{ __html: guide.content }}
        />

        {/* FAQ section */}
        <div className="border-t border-surface-border pt-8 mb-10">
          <h2 className="font-display text-brand-navy font-bold text-xl mb-5">Frequently Asked Questions</h2>
          <div className="space-y-5">
            {guide.faqs.map(({ q, a }) => (
              <div key={q} className="bg-white rounded-lg border border-surface-border p-5">
                <h3 className="font-display text-brand-navy font-semibold text-sm mb-2">{q}</h3>
                <p className="font-body text-gray-600 text-sm">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-brand-teal rounded-xl p-6 text-white">
          <h2 className="font-display font-bold text-lg mb-2">
            Ready to Find a DPC Practice Near You?
          </h2>
          <p className="font-body text-sm opacity-90 mb-4">
            Browse our directory of Direct Primary Care practices across all 50 states. Filter by city, specialty, telehealth availability, or whether the practice sees children.
          </p>
          <Link
            href="/listings"
            className="inline-block bg-white text-brand-teal font-body font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Browse DPC Practices
          </Link>
        </div>

        {/* Related guides */}
        <div className="mt-10">
          <h2 className="font-display text-brand-navy font-bold text-sm uppercase tracking-wide mb-4">
            More DPC Guides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GUIDES.filter(g => g.slug !== slug).map(g => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="bg-white border border-surface-border rounded-lg p-4 hover:border-brand-teal transition-colors"
              >
                <p className="font-display text-brand-navy font-semibold text-sm">{g.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
