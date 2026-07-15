import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangePasswordForm } from "@/components/account/change-password-form";

export default function AccountSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your account security.</p>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            You&apos;ll need to confirm your current password to set a new one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
