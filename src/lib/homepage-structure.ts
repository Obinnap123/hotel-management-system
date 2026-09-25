export const homepageFeaturedRoomLimit = 3;

export type HomepageSectionVisibility = {
  showFeaturedRooms: boolean;
  showFacilities: boolean;
  showAboutHotel: boolean;
  showBookingSteps: boolean;
};

export const defaultHomepageSectionVisibility: HomepageSectionVisibility = {
  showFeaturedRooms: true,
  showFacilities: true,
  showAboutHotel: true,
  showBookingSteps: true,
};

export function selectDefaultFeaturedRoomTypeIds<
  RoomType extends {
    id: string;
    coverImage: string | null;
    roomInventoryCount: number;
  },
>(roomTypes: RoomType[]) {
  return roomTypes
    .filter((roomType) => roomType.roomInventoryCount > 0)
    .slice()
    .sort((first, second) => {
      if (first.roomInventoryCount !== second.roomInventoryCount) {
        return second.roomInventoryCount - first.roomInventoryCount;
      }

      return Number(Boolean(second.coverImage)) - Number(Boolean(first.coverImage));
    })
    .slice(0, homepageFeaturedRoomLimit)
    .map((roomType) => roomType.id);
}
