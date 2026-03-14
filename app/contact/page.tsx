import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Globe } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Контакты школы</h1>
          <p className="text-muted-foreground text-lg">Свяжитесь с нами по любым вопросам</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Email</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <a href="mailto:info@nis.edu.kz" className="text-primary hover:underline">
                info@nis.edu.kz
              </a>
              <p className="text-sm text-muted-foreground mt-2">Общие вопросы</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Телефон</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <a href="tel:+77172709000" className="text-primary hover:underline">
                +7 (7172) 70 90 00
              </a>
              <p className="text-sm text-muted-foreground mt-2">Пн-Пт: 9:00 - 18:00</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Адрес</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">г. Астана</p>
              <p className="text-sm">ул. Кабанбай батыра, 53</p>
              <p className="text-sm text-muted-foreground mt-2">010000, Казахстан</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Веб-сайт</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <a
                href="https://nis.edu.kz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                nis.edu.kz
              </a>
              <p className="text-sm text-muted-foreground mt-2">Официальный сайт</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>По вопросам клубов</CardTitle>
            <CardDescription>Специальная поддержка для платформы NIS CLUBS</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Email:</span>{" "}
              <a href="mailto:clubs@nis.edu.kz" className="text-primary hover:underline">
                clubs@nis.edu.kz
              </a>
            </p>
            <p className="text-sm text-muted-foreground">Для вопросов о создании клубов, вступлении и управлении</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
