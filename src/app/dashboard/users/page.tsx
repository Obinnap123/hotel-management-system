import { UserClient } from "@/components/dashboard/UserClient";
import { requireAdmin } from "@/features/rooms/authorization";
import { getStaffUsers } from "@/features/users/queries";

type UsersPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
});

const successMessages: Record<string, string> = {
  "user-activated": "Staff account activated.",
  "user-deactivated": "Staff account deactivated.",
};

const errorMessages: Record<string, string> = {
  "invalid-user": "Unable to update staff account.",
  "activate-failed": "Unable to activate staff account.",
  "deactivate-failed": "Unable to deactivate staff account.",
};

export default async function UsersPage({ searchParams }: UsersPageProps) {
  await requireAdmin();

  const [users, params] = await Promise.all([getStaffUsers(), searchParams]);
  const notice = params?.success ? successMessages[params.success] : undefined;
  const error = params?.error
    ? errorMessages[params.error] ?? decodeURIComponent(params.error)
    : undefined;

  return (
    <UserClient
      error={error}
      notice={notice}
      users={users.map((user) => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: dateFormatter.format(user.createdAt),
        bookingsCreatedCount: user._count.bookingsCreated,
        paymentsRecordedCount: user._count.paymentsRecorded,
        guestsCheckedInCount: user._count.bookingsCheckedIn,
        guestsCheckedOutCount: user._count.bookingsCheckedOut,
      }))}
    />
  );
}
