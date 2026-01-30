import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, User, CreditCard, Shield } from 'lucide-react';

const planFeatures = {
  free: ['1 signup page', 'Up to 100 subscribers', 'Basic templates'],
  pro: ['Unlimited pages', '10,000 subscribers', 'All templates', 'No branding'],
  business: ['Everything in Pro', 'Custom domains', 'Team access', 'API access'],
};

export default function Settings() {
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', profile.id);

      if (error) throw error;

      await refreshProfile();
      toast({
        title: 'Profile updated',
        description: 'Your changes have been saved.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update profile.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Settings"
      description="Manage your account and subscription."
    >
      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Profile</CardTitle>
            </div>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profile?.email || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Subscription</CardTitle>
            </div>
            <CardDescription>Manage your subscription plan.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold capitalize">{profile?.plan || 'Free'} Plan</p>
                  <Badge variant={profile?.plan === 'free' ? 'secondary' : 'default'}>
                    {profile?.plan === 'free' ? 'Current' : 'Active'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {profile?.plan === 'free' 
                    ? 'Upgrade to unlock more features'
                    : 'You have access to premium features'}
                </p>
              </div>
              {profile?.plan === 'free' && (
                <Button className="gradient-primary">
                  Upgrade
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Your plan includes:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {planFeatures[profile?.plan || 'free'].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Manage your security settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline">
              Change Password
            </Button>
            <p className="text-xs text-muted-foreground">
              You'll receive an email with instructions to reset your password.
            </p>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions for your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" disabled>
              Delete Account
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              This will permanently delete your account and all associated data.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
