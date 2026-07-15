import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/account/profile-form";
import { getCurrentProfile } from "@/lib/security/authorize";

export default async function ProfilePage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">Update your personal details.</p>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>This information is private and only used for your orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>
    </div>
  );
}
