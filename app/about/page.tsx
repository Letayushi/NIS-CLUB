import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Target, Sparkles, Shield } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-balance">О проекте NIS CLUBS</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Платформа для управления школьными клубами, созданная для учеников Назарбаев Интеллектуальных Школ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Наша цель</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Предоставить ученикам удобный доступ к информации о клубах и возможность легко присоединяться к
                интересующим направлениям.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Для кого</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Платформа создана для учеников, владельцев клубов и администрации школы для эффективного управления
                внеклассной деятельностью.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Возможности</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Просмотр всех школьных клубов</li>
                <li>• Подача заявок на вступление</li>
                <li>• Предложение новых клубов</li>
                <li>• Управление клубами для владельцев</li>
                <li>• Публикация анонсов и новостей</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Безопасность</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Доступ к платформе осуществляется через школьный email. Все заявки на создание клубов проходят модерацию
                администрацией.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Контакты</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Email:</span>{" "}
              <a href="mailto:clubs@nis.edu.kz" className="text-primary hover:underline">
                clubs@nis.edu.kz
              </a>
            </p>
            <p className="text-sm">
              <span className="font-medium">Телефон:</span> +7 (7172) 70 90 00
            </p>
            <p className="text-sm">
              <span className="font-medium">Адрес:</span> г. Астана, ул. Кабанбай батыра, 53
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
