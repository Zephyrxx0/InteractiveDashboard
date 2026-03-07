import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { ProjectCard } from "@/components/features/project-card";
import { Button } from "@/components/ui/button";

const projects = [
    {
        id: "WTR-092",
        title: "Clean Water Initiative - Phase 2",
        description: "Implementation of solar-powered filtration systems in rural districts. Includes community training.",
        status: "active" as const,
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuNsv5dljp4Uo2EajvWkyAMnWhIhPgZ0NbxIl700OGIfxbwWfiUe4LyS1TA5RxlcOdWAjE7aGlRgGLbGkgtd-OjVfG5jQk3gN1AHp9NaC7M9WZSGfFt1hqfVUd7VGSFDpvAtUPySfh8kubfkMru-tacedffkDA8QQc88T2Q6H7iXBo3z-dXBBsauFmGn0E3WXKvuUmf0LqOz-TMTLmz_FazM07aBBLU5jFj8sZbaJl1GsPsFt-TtWFMvjS3o4QFgNfgIE_5DddzoPw",
        budget: "$150,000",
        lead: { name: "S. Miller", avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBL6WMKG_Yi1s4BgZwiAwoVP7jrA0xAFea_RMyUrbopRyysuHKrkrjDly-9tS33slo8nIiLhJznV7vn6Li_V9nqigK4K0Rm6nh7vAJl4uexpmdp6gSTHhcKRBHcSefYYwTEO2_G-OlJCbw6epBl0UgCgTQZOgGuyexsKRo4NAaIsBUe5rLei-5eBN-jPAFlw1XbBjoIe7MV_1FtatKu5mwZ31ig6F4Z2tpo_DKBiJVkiSzBeDVHfjINlQ2Voq1IPoKhuJU4TXzkYLve" },
        deadline: "12 Oct 2024",
        region: "SE Asia",
        progress: 65,
        href: "/projects/WTR-2024-882",
    },
    {
        id: "FOR-115",
        title: "Reforestation Sector 7",
        description: "Large scale planting of native species to combat soil erosion. Logistics delayed due to weather.",
        status: "warning" as const,
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgs4VOF8ZBuEIHCJy5YsHw23TCAcKWGGxn9T17eUs8uYW9BzD23mqs9v_0i_VHy1UeV3FQTV_10tih6JyXv45HUd1K_BGvkkXhSI7UPvM_jq3XdwVa_Lk44eSZn0OHAoeQdmqK0QU1ZyonvpiXrLT_4peLa_boBH2i_cVKANbNztUfrIxlSRKN68Fcc0JnhG5tnSWlKjHI5dkYXeQvhF1YJcrBvSYu-CYZksXiCte2FetT-5X93BbcFglF51RjVHxcBMhROmBhUt-v",
        budget: "$75,000",
        lead: { name: "D. Chen", avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1qEmWvDdkAS75S2mO28P9rINByPVIFfn-Pz8u43onVuiot7kW6gCZah8Yh5UZgShs4jQkLjfVPDyzXwvvBJzD7yEgq5xtiUIgN2C9TMEGekO4jlF0QcwhROEA98Xoj0dXKoQEq2s38LjEQz8I69IBlgRt3TTENcQy_r0suGtDpSCyqZrI7AUxVPQy2PgQimX6Fu2LQiW9ly6P0jtYMSu0cY7fNAHct5qBn11UKvCuP0ukNWFgJeHfjXzWJe5TaCTIGRZgW0xM2b1p" },
        deadline: "28 Nov 2024",
        region: "S. America",
        progress: 30,
    },
    {
        id: "URB-044",
        title: "Urban Vertical Gardens",
        description: "Experimental hydroponic towers in dense city centers. Project paused pending permit review.",
        status: "halted" as const,
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAp9nS_GE4u8jrWIF2xnj7QEIwpwhIjU7ER8xIFXx8JarbMQdamUXjHANROt-7M66dcAVi0cKDMTbYGT5No1pWeqVzk8C__R3B94-ie4YfEsIbkrtm4XPx4VlyvI-lOS-Ic4M04wofsOYmFW4yps7uveNxfDFoSVL8w1ahQ8MUgQV9ENvQLpNVtVjIGWjmzd59CONDz8IJGziNN3ui_j6K7o75A8EhLVGKKMIW6AOByRexC22HrJdC0X6goCkn2rNOu1uKk-doY2HdG",
        budget: "$210,000",
        lead: { name: "M. Garcia", avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYbGXCtNN4b1qqCCAmNNXv9NOgot1S7ey9q1O3N1DkYX3NQ8Db1fPmS0X7FuKBBZJR-D1QnjiJ6jeLsXocN8vipnf6jvO96hawnPPpwH0awY7oLKsIsf1bJoxCPgk2tRX2ul31yDLXxo1NYDko1xwG_yY3OzL7oizElrd_cm6aVbRi4RS-FrypCSx7BYEdCLKQq0muYgiZicRdvDJLPTN3Wonavb-alvx5CY1oscRhHBm67Zs0a7Az97FCbXbRBnvtsDb-VFft7KWq" },
        deadline: "Overdue",
        region: "E. Europe",
        progress: 10,
    },
    {
        id: "EDU-201",
        title: "Education Tech Rollout",
        description: "Distributing 5,000 ruggedized tablets to remote schools. Software installation complete.",
        status: "active" as const,
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHe5zJa0a53GbQ4MxETS5YNCWZi_krJRnwT0YeSgENr2i8OLUa4F2KyKzkSBHJR22i8IDKm3AsuELzlGJy6WrsRcUJv2cSnzp0cQIOiFHJjOweXxFbp5b821O6BskHI33vPZoadF16IPF98LBpO1Irr-pvkd-HS5V8JLxJSQ1JISaAem4HCmdzNIPFiPx3Dkz45CdXAtCoroN88GxZFnBnrhfSXstjHTnqnBaavmetXUUWDWjhu5Egopf7QXVGl-fweAN39Zkonghn",
        budget: "$500,000",
        lead: { name: "J. Kim", avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTjm_-li1kTL1nPO1XtFWSzzaqMWdhiqX3HofcbIhIJ7Cgj9jU46TXz2NicEKhyPAJtHYZzSgoYesLs9CDxdva44OTpUCU_X5EcVKm45woQDFn2Ds9WvqoEc8Dg0jzpkh1aYu7IW_SCul3iJnt_CzuoCfwD6PafrXHWshkYIfFmegzB70FVlc4jWbGnvQzwEM7o9AnMl8IT6E0rYaGcMToH7HaS52k2c0Mn_kFE_F3wM-vPDgtNEVQQX4XFJIPp5L61Qjki-ugDg84" },
        deadline: "15 Jan 2025",
        region: "Global",
        progress: 88,
    },
    {
        id: "NRGY-005",
        title: "Micro-Grid Solar Pilot",
        description: "Testing decentralized power generation for off-grid clinics. Battery storage installation phase.",
        status: "active" as const,
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhlT50p-RbpEM-smbJdrhCT7g1k3ixjdznOPcRAI7gM1qeJ0J7JPNUxhNEOqV91k0lG1brv5yJ3KF3FcdjDpCflLSEMtUVMRDGn0xqqyfwEbYC1QhXjHyTRbtP7LEE3azHT4t3hW30pnF_StqPyYRH-EuONzaRR5uZiklZZeHgI8wlPZ0c_10UbVzZJi0ns4L_4cyYVukixnRI6c8Xwdz5eOFPZbYMkeJSUn-STywW0NnG-QnxAfW2TCXU7H5PrSZ2dyZrtlqSY24t",
        budget: "$320,000",
        lead: { name: "P. Rao", avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7_Q39V1SUNyeEu6Cw-bJl6k8lULZNAw_x2fY4KK1anWlWJetK7leIA0GZ1wRfnUceimOieHnf0DRjYa5JRSJRLzxK91eSU-Vr6bO6kLv96daL50a-LOkbdje77cDhT9LixoXjeq_qugaxYNgEc5q2OZnIbVC2NKHh-iNSsrk-66wQYInpx-bL5XSs6DKbVuMk4HXdYV7VrKFc4gXJmZ4ioe5scmalZgJNrEXvpJBVoW69kw3gDhf-WbZP9GIUAKyf2-ILYoIz0ea0" },
        deadline: "01 Mar 2025",
        region: "SE Asia",
        progress: 45,
    },
    {
        id: "AGR-772",
        title: "Drone Crop Analysis",
        description: "Using multi-spectral imaging to detect early signs of blight in wheat crops.",
        status: "planning" as const,
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXT1BE7MIRTo87nvGR8mhinvAgz26vo1MxccGOW0Ze3tkgtlgxVORD_7UKZZw57qSM_evLCgWMWglRO0hlzNTpAjMUsep_ZCPgGb7Vok1sC8NjH-vdIkotNUIw4mUd1SlD1-axHhtZbhyEAZowQV9JOQEZDd2FnBgbJ-UP7Nfe95P1lSa0flYuurcgsUX1BDODiX66hJkYvhCzCRSUtZHvFuJ1GIINZ0sKlWHeMRYdN11haa7HUakQpfCTVAEbqtGbZUfb6sR40O66",
        budget: "$90,000",
        lead: { name: "K. Tanaka", avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCn5QGOTfpYg075H6jldH-tzLyQ142BNVZmjRJWU_KvzKsXLF7pKTa7u_QqStVvmii0h-0BRtQAOOILL9PzYdL1D0lrpuiwTD8c4HYqdWzjhM7tgIXl4L0FsXAo5dvK2bruU4dZMwbcUIjzeTHodyDj_IhKiDKfdQQ8qke2eCjRFQZm035UeBwLzRaLOpc1LN-OkonWl90tchlwGaFimnEkOgoBTIhXmDP6Rlb3ZUtdpcWmEfTMwLF2UZDeinWelG_kYGN7Y8D7LZvS" },
        deadline: "TBD",
        region: "E. Europe",
        progress: 5,
    },
];

export default function ProjectHubPage() {
    return (
        <>
            <PageHeader
                title="Project Hub"
                subtitle="Showing 6 of 42 projects"
                actions={
                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-card border border-border">
                            <button className="p-2 hover:bg-background text-primary border-r border-border">
                                <span className="material-symbols-outlined text-[20px]">grid_view</span>
                            </button>
                            <button className="p-2 hover:bg-background text-muted-foreground">
                                <span className="material-symbols-outlined text-[20px]">view_list</span>
                            </button>
                        </div>
                        <Link href="/projects/new">
                            <Button className="font-mono text-xs uppercase tracking-wider font-bold shadow-[var(--shadow-brutal)] hover:shadow-[var(--shadow-brutal-hover)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
                                <span className="material-symbols-outlined text-[18px] mr-2">add</span>
                                New Project
                            </Button>
                        </Link>
                    </div>
                }
            />

            <div className="flex-1 overflow-y-auto bg-background relative">
                <div className="absolute inset-0 grid-bg pointer-events-none z-0" />
                <div className="p-8 relative z-10 max-w-[1920px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <ProjectCard key={project.id} {...project} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
