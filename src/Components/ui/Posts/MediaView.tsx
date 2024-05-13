import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useState } from "react";
import ReactPlayer from "react-player/lazy";

interface Props {
  fileUrls: string[];
}

export const MediaView = ({ fileUrls }: Props) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const handleSlideChange = (event: any) => {
    const newIndex = typeof event === "number" ? event : event.target.value;
    setActiveSlide(newIndex);
  };

  return (
    <>
      <div className="relative w-full">
        <Carousel
          className="w-full"
          plugins={[
            Autoplay({
              delay: 12000,
            }),
          ]}
          // Update the active slide index on change
        >
          <CarouselContent
            // Control the current slide
            onChange={handleSlideChange}
          >
            {fileUrls?.map((url: string, index: number) => (
              <CarouselItem key={index}>
                <div className="w-full flex justify-center  object-cover rounded-md overflow-hidden">
                  {url.includes(".jpg") ||
                  url.includes(".jpeg") ||
                  url.includes(".image/jpg") ||
                  url.includes(".image/jpeg") ||
                  url.includes(".image/png") ||
                  url.includes(".image/mp4") ||
                  url.includes(".image/mov") ||
                  url.includes("_undefined") ||
                  url.includes(".png") ? (
                    <img
                      src={url}
                      alt={`Slide ${index + activeSlide + 1}`}
                      loading="lazy"
                      className="object-cover size-[70%] rounded-xl border-2 border-[#87CEEB]"
                      //style={{ maxHeight: "720px" }}
                    />
                  ) : url.includes(".mp4") || url.includes(".mov") ? (
                    <ReactPlayer
                      style={{ border: "2px", borderRadius: "12px" }}
                      width={"80%"}
                      height={"80%"}
                      className="border-2 border-[#87CEEB]"
                      url={`${url}-U`}
                      controls
                      muted={false}
                    />
                  ) : null}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {fileUrls &&
            fileUrls.length > 1 && ( // Conditional rendering based on the number of items
              <>
                <CarouselPrevious className="absolute left-0 z-10" />
                <CarouselNext className="absolute right-0 z-10" />
              </>
            )}
        </Carousel>
      </div>
    </>
  );
};
