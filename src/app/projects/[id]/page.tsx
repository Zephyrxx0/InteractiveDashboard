import { Header } from "@/components/header";
import { MetricCard } from "@/components/metric-card";
import { TaskList } from "@/components/task-list";
import { MediaGallery } from "@/components/media-gallery";
import { Button } from "@/components/ui/button";

const tasks = [
  {
    id: "1",
    name: "Initial Site Survey - District A",
    completed: true,
    assignee: {
      name: "Marcus L.",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyp--EyP9XWCUwMtfIMFvRVI7TqztFNs25kYP2SaJnbd0obb4PmniyNfV8ENeRkeh9SzkOXVHEE1y7Zu3F5MLKx-cuqCtseikHSSMwpXUMcc8CXFy-MLtcFnTsMNNb-tP6jZZAu64Qj1zMDtme0M5lgsAD-nh6pHMNdh3p2jlYERnbOUqvbE88YM1nvde8JDroZuCLZ_nx0ijc4gXQpKwms9YNi-jF8qwoEYBXvIA8GZIzXuFAvPpdCqTomnUkwYKGPLGXHDNWras2",
    },
    dueDate: "Oct 12",
  },
  {
    id: "2",
    name: "Procure Filtration Units (Type B)",
    tag: { label: "Pending", color: "bg-eco-ochre/10 text-eco-ochre" },
    assignee: {
      name: "Sarah M.",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgEADqT1rdrKWMNSO-_2lWxTnTji8jOkDmX6dQqqCsorC7KWGpGiJa4epgNCv1RFG-2oOjbY-52VyXJJR7m0tXAnuKv65vn04VBz2-W-0kMczFOmOv1wDhMJwp88MqC3ykgmkFCfExcPe3N8HyPuOaSXXAQwNsPbGyTMIc2oGPOY48nZ8rOqA1t532FoD8Tm4EMQZ8UuyNL5iodm3y_9liPvKEUGWyQ8rdhLr-7AhRsZLTdY6cAzwnVe3Y8RnFgrOPr2DMB859ZLa-",
    },
    dueDate: "Oct 15",
    dueDateUrgent: true,
  },
  {
    id: "3",
    name: "Coordinate Logistics Team",
    dueDate: "Oct 18",
  },
  {
    id: "4",
    name: "Water Quality Baseline Testing",
    assignee: {
      name: "David K.",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNE-VIkwW3zvvqLP8GAuduBciXqV9sj0_44wVWRrsfi0aMX6t43EYXMIY4TAqyg1C5VxuEE_lCkDu9N32-GARH3oaVtFvD2N9cxFNoCOvHhwoEHszA6eI-_J3hko74KXrvUFnXqTO8gKx-jkfXSa1B8Xo9G8sYchrdDDVvNOAbGO8_tRKemcbBdRFjNhp_qWztrJIPDVngX1wN2dousz23CmDdsodsJtANpi6qGi7WSILDElkvCalvvHTAmPnzMWLeLtfHYNrn_o4h",
    },
    dueDate: "Oct 20",
  },
];

const galleryImages = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC04JjCffozpZg_43MMQ2XgQmtMrywEoG_C-v6a73GuowfmHNdc6WOWbCDazy4WzXcBVEBx5YjIXTqJH1t4m-QMgSJ8ch1_uAtsMeIRNuKRnrrlREvl3apYwMCGDwnAxPln-N9E1kNmjE7R9Aac-2huT9ZZR1RHXrPBp8y1lRQW_3Biw9tg1c6CctSUEXBOFd4xQw495Q0RxD5jphWH28eYdxdvK0iTKfu3i0WrAJWQUzRqmrteDNOpEtFLuLtWLw0_6D_bn3GpcsJ_",
    alt: "Worker inspecting blueprints on site",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxE_3DtTSL2Iy0ZHfsq_5G6GY0YH8iVJVxvN7iwPZtCIVB4de_AP3sw8UXWtO-s4YeaO_xxvE11uGzoSilYdc2_Y4dMfyWGMqjz1O7zh7TspL79QhPLUsQhjidRiNmWYvaXJTGi6w_adaAECXhtrwSc9cS-ujcbmtflLQPMENDypQTmp14VevPRFjfO96AYKFvNnDQ-C1gHHJc07bZ0Ck5GXt8fpdbieO0hqnh4-DUfv8WIexQMBxTlj2B-TaLSy21Xd6C9jr5a7EQ",
    alt: "Clean water tap installation",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtuWj3Gbn78uqDF8AGZ-owOvs825LsXOxX9k-dNErDANFXiaeZKoOg0GG7d7G7NizC8JOgyrWvESLtymYXPQCW1wGRubUULPr1XCKdhNBzUdts_29rkHPhwzaYYk6Q_RHeaelyVHxwoTAfUQzJZXcEQRzHOIbfxcsw6ANA7peaNY8NvWYOXJlpr5H4I9--7ByEIdnnEWx8NJKo4Y0ixF-vgoF1LMGYtjLVgrfBNUbXRc0vw4UvPcUkiC0KcaDUyNoXznaQdYPLJIVX",
    alt: "Site vegetation progress",
  },
];

const teamMembers = [
  { name: "Sarah M.", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC29F2qw9BrjkrxBbQ4BRqQ0UyuUzs7almj0HLyvAr1P5oXiYTFEKvXjPs-BtUd_Fp7PKbBGsLsLtv0OQDog8jZyQ-2tU7JlEgWkp7-FibnLW20q0cwrJZ5cAHbwNwr-E5boDOSBrNr4V2WDJC6nCLV2rCSQhtytFUyhYIgA5hIcyIxkyZSCTxWFQuYSHilo3b3f1x7DwR-fC0x3yYpHe6IGepZeaRi-vg_7cqf8t9M99gV39m7C5_C-MYbGwxsQEoQxECN-QRbm7-n" },
  { name: "David K.", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8zDbdiUQpB949YQommlGm9Lw_MJFrjeks5Q-kKYQQbk3zczpGBZ7VmthJ0jmb-boUveSFqzx6wRW0Yj9nU9qYKc5XOR5onDP4EP955VwZIv3N0eiavjYqVnCVuRS0Z1s3ZLndoFhQhJGo1Lx0g7PTfvaignxcvf8Cp2VccDQYkzP2SA_8yNSrp_llCHWOM48qe5JtC_pmy08c8gxr1vqTagTbaZfKj18kkDh5CReHolBj1JSd40k_JVOjh1r0eUxTEG-6O0MqT689" },
  { name: "Marcus L.", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaDpqsfLjqImqajGWE6NbU4NMcFH5PNr_Md-keCZfcvK-NUpgs4xFcRZOqd_hdToT82pM4bW92RloNFr1ug-rXD5zl5Ol3UERXKovqsjZrSK9KZQcJFNG7guOr2Jpf-B4xXT37H5TsD3g_WdbBeIWGChwjIY99sbti5wzdlg_RPA1bRQM5w5WWpdPikyR0OW4RVs6N5DmPjEF5QYwpSbv05dc73zUUlCppGbfcxA28M_6tGdk96zGvU5WERlF8-Vj93UGjehlv1Cjn" },
];

export default function ProjectDetailPage() {
  return (
    <>
      <Header activeNav="blueprint" />

      {/* Archived Banner */}
      <div className="bg-eco-clay/10 border-b border-eco-clay/20 py-2 px-6 text-center">
        <p className="text-eco-clay text-sm font-mono font-medium flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">archive</span>
          PROJECT ARCHIVED: READ-ONLY MODE
        </p>
      </div>

      <main className="flex-1 max-w-[1440px] mx-auto w-full p-6 md:p-10 space-y-8">
        {/* Project Header */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="bg-primary/10 text-eco-primary-dark border border-primary/20 px-2 py-0.5 text-xs font-mono font-bold uppercase tracking-wide">
                Active
              </span>
              <span className="text-muted-foreground text-xs font-mono uppercase tracking-wide">
                ID: #WTR-2024-882
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-semibold text-foreground tracking-tight">
              Clean Water Initiative - Phase 2
            </h1>
            <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
              Deploying sustainable filtration systems across 12 rural districts. Focus on long-term maintenance training and water quality monitoring.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button variant="outline" className="flex items-center gap-2 text-sm font-medium">
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Edit Project
            </Button>
            <Button variant="outline" className="flex items-center gap-2 text-sm font-medium">
              <span className="material-symbols-outlined text-[18px]">ios_share</span>
              Export Data
            </Button>
            <Button className="flex items-center gap-2 text-sm font-medium shadow-sm">
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Task
            </Button>
          </div>
        </section>

        {/* Navigation Tabs */}
        <nav className="flex gap-8 border-b border-border">
          <button className="pb-3 text-sm font-medium text-foreground border-b-2 border-primary">Overview</button>
          <button className="pb-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border-b-2 border-transparent hover:border-border">Financials</button>
          <button className="pb-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border-b-2 border-transparent hover:border-border">Logistics</button>
          <button className="pb-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border-b-2 border-transparent hover:border-border">Impact Report</button>
        </nav>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-10">
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card border border-border p-4">
                <p className="text-xs font-mono text-muted-foreground uppercase mb-1">Progress</p>
                <p className="text-2xl font-display font-semibold text-foreground">68%</p>
                <div className="w-full bg-background h-1 mt-3">
                  <div className="bg-primary h-1" style={{ width: "68%" }} />
                </div>
              </div>
              <div className="bg-card border border-border p-4">
                <p className="text-xs font-mono text-muted-foreground uppercase mb-1">Budget Used</p>
                <p className="text-2xl font-display font-semibold text-foreground">$32k</p>
                <p className="text-xs text-muted-foreground mt-1 font-mono">of $50k</p>
              </div>
              <div className="bg-card border border-border p-4">
                <p className="text-xs font-mono text-muted-foreground uppercase mb-1">Installations</p>
                <p className="text-2xl font-display font-semibold text-foreground">142</p>
                <p className="text-xs text-primary mt-1 font-mono flex items-center gap-1">
                  <span className="material-symbols-outlined text-[10px]">arrow_upward</span> +12 this week
                </p>
              </div>
              <div className="bg-card border border-border p-4">
                <p className="text-xs font-mono text-muted-foreground uppercase mb-1">Days Left</p>
                <p className="text-2xl font-display font-semibold text-foreground">45</p>
                <p className="text-xs text-eco-ochre mt-1 font-mono">On Schedule</p>
              </div>
            </div>

            {/* Task List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-display font-medium text-foreground">Active Tasks</h3>
                <div className="flex gap-2">
                  <button className="text-xs font-mono text-muted-foreground hover:text-primary uppercase">Filter</button>
                  <span className="text-muted-foreground text-xs">/</span>
                  <button className="text-xs font-mono text-muted-foreground hover:text-primary uppercase">Sort</button>
                </div>
              </div>
              <TaskList tasks={tasks} />
            </div>

            {/* Field Notes */}
            <div>
              <h3 className="text-lg font-display font-medium text-foreground mb-4">Field Notes</h3>
              <div className="space-y-4 border-l border-border ml-2 pl-6 relative">
                <div className="relative">
                  <div className="absolute -left-[29px] top-1.5 size-2.5 bg-background border-2 border-primary rounded-full" />
                  <p className="text-xs font-mono text-muted-foreground mb-1">Today, 10:42 AM</p>
                  <p className="text-sm text-foreground">Water samples from Sector 4 show pH levels stabilizing at 7.2. Uploaded results to data hub.</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[29px] top-1.5 size-2.5 bg-background border-2 border-border rounded-full" />
                  <p className="text-xs font-mono text-muted-foreground mb-1">Yesterday, 4:15 PM</p>
                  <p className="text-sm text-foreground">Delivery of filtration units delayed by weather. Rescheduled for Thursday morning.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <aside className="lg:col-span-1 space-y-8">
            {/* Project Details Card */}
            <div className="bg-card border border-border p-6 space-y-6">
              <h3 className="text-sm font-display font-semibold uppercase tracking-wider text-foreground border-b border-border pb-2">
                Project Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">Lead</span>
                  <div className="text-right">
                    <span className="block text-sm font-medium text-foreground">Sarah Miller</span>
                    <span className="block text-xs text-muted-foreground">Field Operations</span>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">Budget</span>
                  <div className="text-right">
                    <span className="block text-sm font-medium text-foreground">$50,000.00</span>
                    <span className="block text-xs text-primary font-mono">Approved</span>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">Region</span>
                  <div className="text-right">
                    <span className="block text-sm font-medium text-foreground">Sub-Saharan Africa</span>
                    <span className="block text-xs text-muted-foreground">District 12-B</span>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">Donors</span>
                  <div className="text-right">
                    <span className="block text-sm font-medium text-foreground">Global Water Fund</span>
                    <span className="block text-xs text-muted-foreground">Grant #8821</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Media Gallery */}
            <MediaGallery images={galleryImages} />

            {/* Team Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-display font-semibold uppercase tracking-wider text-foreground border-b border-border pb-2">
                Team Access
              </h3>
              <div className="flex -space-x-2 overflow-hidden py-1">
                {teamMembers.map((member) => (
                  <img
                    key={member.name}
                    alt={member.name}
                    className="inline-block size-8 rounded-full ring-2 ring-white grayscale hover:grayscale-0 transition-all cursor-pointer"
                    src={member.src}
                  />
                ))}
                <button className="inline-flex size-8 items-center justify-center rounded-full bg-background ring-2 ring-white border border-border hover:bg-muted">
                  <span className="material-symbols-outlined text-sm text-muted-foreground">add</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
