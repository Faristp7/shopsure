import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type AdminSectionShellProps = {
  title: string
  description: string
  children?: React.ReactNode
}

export function AdminSectionShell({ title, description, children }: AdminSectionShellProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  )
}

type AdminPlaceholderCardProps = {
  cardTitle: string
  cardDescription: string
}

export function AdminPlaceholderCard({ cardTitle, cardDescription }: AdminPlaceholderCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Configuration UI will connect here when backend APIs are ready.
        </p>
      </CardContent>
    </Card>
  )
}
