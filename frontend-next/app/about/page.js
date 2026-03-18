import AboutUsClient from '../../components/AboutUsClient';
import '../../styles/AboutUs.css';

export const metadata = {
    title: 'আমাদের সম্পর্কে | Titas - Dhaka University',
    description: 'তিতাস- ঢাকা বিশ্ববিদ্যালয়স্থ ব্রাহ্মণবাড়িয়া জেলা ছাত্রকল্যাণ পরিষদের পরিচয়, লক্ষ্য ও ইতিহাস।',
};

export default function AboutPage() {
    return (
        <main className="about-page">
            <AboutUsClient />
        </main>
    );
}
