import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";

export function Profile() {
  return (
   <Card>
    <CardHeader>
      <CardTitle>Profile</CardTitle>
    </CardHeader> 
      <CardContent>
        <ul className="space-y-4">
          <ProfileAspect title="Openness" value={20} />
          <ProfileAspect title="Conscientiousness" value={50} />
          <ProfileAspect title="Extraversion" value={30} />
          <ProfileAspect title="Agreeableness" value={50} />
          <ProfileAspect title="Neuroticism" value={33} />
        </ul>
      </CardContent>
   </Card>
  )
}

type ProfileAspectProps = {
  title: string
  value: number | null
}

const ProfileAspect = ({ title, value }: ProfileAspectProps) => {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium">{title}</p>
      <Progress value={value} className="w-24" />
    </div>
  )
}