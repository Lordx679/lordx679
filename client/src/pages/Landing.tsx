import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-discord-darkest text-white" dir="rtl">
      {/* Navigation Header */}
      <nav className="bg-discord-darker border-b border-discord-dark sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center">
                <i className="fab fa-discord text-discord-blurple text-2xl ml-3"></i>
                <span className="text-xl font-bold">مشاريع ديسكورد</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              <Button
                onClick={() => window.location.href = "/api/login"}
                className="bg-discord-blurple hover:bg-blue-600 transition-colors"
              >
                <i className="fab fa-github ml-2"></i>
                تسجيل الدخول
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-discord-blurple/20 to-discord-dark/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            اكتشف أفضل مشاريع
            <span className="text-discord-blurple"> ديسكورد</span>
          </h1>
          <p className="text-xl text-discord-text mb-8 max-w-3xl mx-auto">
            منصة شاملة لعرض ومشاركة مشاريع ديسكورد المبتكرة - من البوتات إلى الخوادم والأدوات المتقدمة
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.location.href = "/api/login"}
              className="bg-discord-blurple hover:bg-blue-600 px-8 py-3 text-lg transition-all transform hover:scale-105"
            >
              <i className="fas fa-rocket ml-2"></i>
              استكشف المشاريع
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = "/api/login"}
              className="border-2 border-discord-blurple text-discord-blurple hover:bg-discord-blurple hover:text-white px-8 py-3 text-lg transition-all"
            >
              <i className="fab fa-github ml-2"></i>
              ربط GitHub
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-discord-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">لماذا مشاريع ديسكورد؟</h2>
            <p className="text-discord-text max-w-2xl mx-auto">
              منصة مجتمعية متكاملة تجمع المطورين والمبدعين لمشاركة أفضل مشاريع ديسكورد
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-discord-elevated border-discord-dark">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-discord-blurple/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-robot text-discord-blurple text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">بوتات متقدمة</h3>
                <p className="text-discord-text">
                  اكتشف مجموعة واسعة من بوتات ديسكورد المتخصصة والمتقدمة
                </p>
              </CardContent>
            </Card>

            <Card className="bg-discord-elevated border-discord-dark">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-discord-green/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-server text-discord-green text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">قوالب الخوادم</h3>
                <p className="text-discord-text">
                  قوالب جاهزة لإنشاء خوادم ديسكورد منظمة وفعالة
                </p>
              </CardContent>
            </Card>

            <Card className="bg-discord-elevated border-discord-dark">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-discord-yellow/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-tools text-discord-yellow text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">أدوات مساعدة</h3>
                <p className="text-discord-text">
                  أدوات وإضافات تساعد في تطوير وإدارة مشاريع ديسكورد
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-discord-darkest">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">انضم إلى مجتمع المطورين</h2>
          <p className="text-xl text-discord-text mb-8">
            سجل الدخول باستخدام GitHub واستكشف آلاف المشاريع المبتكرة
          </p>
          <Button
            onClick={() => window.location.href = "/api/login"}
            className="bg-discord-blurple hover:bg-blue-600 px-8 py-3 text-lg transition-all transform hover:scale-105"
          >
            <i className="fab fa-github ml-2"></i>
            ابدأ الآن مجاناً
          </Button>
        </div>
      </section>
    </div>
  );
}
