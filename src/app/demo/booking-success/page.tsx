import { BookingSuccessCard } from "@/components/public/BookingSuccessCard";
import { formatPublicDate } from "@/lib/public/format";

type BookingSuccessPageProps = {
  searchParams?: Promise<{
    booking?: string;
    roomType?: string;
    checkIn?: string;
    checkOut?: string;
  }>;
};

export default async function BookingSuccessPage({
  searchParams,
}: BookingSuccessPageProps) {
  const params = await searchParams;

  return (
    <section className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
      <BookingSuccessCard
        booking={params?.booking ?? "-"}
        checkIn={params?.checkIn ? formatPublicDate(params.checkIn) : "-"}
        checkOut={params?.checkOut ? formatPublicDate(params.checkOut) : "-"}
        roomType={params?.roomType ?? "-"}
      />
    </section>
  );
}
