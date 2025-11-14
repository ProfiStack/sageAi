/*eslint-disable*/
"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const CarouselContext = React.createContext(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

const Carousel = React.forwardRef(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    );
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((api) => {
      if (!api) {
        return;
      }
      setCurrentIndex(api.selectedScrollSnap());
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext]
    );

    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) {
        return;
      }

      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
          currentIndex,
          setCurrentIndex,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef(
  ({ contentWrapperClassName, className, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel();

    return (
      <div
        ref={carouselRef}
        className={cn("overflow-hidden", contentWrapperClassName)}
      >
        <div
          ref={ref}
          className={cn(
            "flex ltr:-ml-4 rtl:-mr-4",
            orientation === "horizontal" ? "" : "flex-col",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "ltr:pl-4 rtl:pr-4" : "pt-4",
        className
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();

    return (
      <button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute  h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "ltr:-left-12 rtl:-right-12 top-1/2 -translate-y-1/2"
            : "-top-12 ltr:left-1/2 rtl:right-1/2 -translate-x-1/2 rotate-90",
          className
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Previous slide</span>
      </button>
    );
  }
);
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();

    return (
      <button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "ltr:-right-12 rtl:-left-12 top-1/2 -translate-y-1/2"
            : "-bottom-12 ltr:left-1/2 rtl:right-1/2 -translate-x-1/2 rotate-90",
          className
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        <ArrowRight className="h-4 w-4" />
        <span className="sr-only">Next slide</span>
      </button>
    );
  }
);
CarouselNext.displayName = "CarouselNext";

const CarouselNavigation = React.forwardRef(
  (
    {
      className,
      variant = "link",
      size = "icon",
      iconType = "chev",
      position = "center",
      placement = "middle",
      ...props
    },
    ref
  ) => {
    const {
      orientation,
      canScrollPrev,
      canScrollNext,
      scrollNext,
      scrollPrev,
    } = useCarousel();
    return (
      <div>
        {canScrollPrev && (
          <button
            ref={ref}
            variant={variant}
            size={size}
            className={cn(
              "absolute h-[52px] w-[52px] rounded-full rtl:rotate-180",
              orientation === "horizontal"
                ? "ltr:-left-12 rtl:-right-12 top-1/2 -translate-y-1/2"
                : "-top-12 ltr:left-1/2 rtl:right-1/2 -translate-x-1/2 rotate-90",
              className,
              variant !== "link" && "bg-[#98A1A8]",
              position === "bottom" && "top-full -translate-y-full",
              placement === "out" && "ltr:-left-28 rtl:-right-28",
              placement === "middle" && "ltr:-left-6 rtl:-right-6",
              placement === "in" && "ltr:left-12 rtl:right-12"
            )}
            disabled={!canScrollPrev}
            onClick={scrollPrev}
            {...props}
          >
            {iconType === "chev" ? (
              <ChevronLeft color="#ffffff" />
            ) : (
              <ArrowLeft color="#ffffff" />
            )}
            <span className="sr-only">Previous slide</span>
          </button>
        )}

        {canScrollNext && (
          <button
            ref={ref}
            variant={variant}
            size={size}
            className={cn(
              "absolute h-[52px] w-[52px] rounded-full rtl:rotate-180",
              orientation === "horizontal"
                ? "ltr:-right-12 rtl:-left-12 top-1/2 -translate-y-1/2"
                : "-bottom-12 ltr:left-1/2 rtl:right-1/2 -translate-x-1/2 rotate-90",
              className,
              variant !== "link" && "bg-[#98A1A8]",
              position === "bottom" && "top-full -translate-y-full",
              placement === "out" && "ltr:-right-28 rtl:-left-28",
              placement === "middle" && "ltr:-right-6 rtl:-left-6",
              placement === "in" && "ltr:right-12 rtl:left-12"
            )}
            disabled={!canScrollNext}
            onClick={scrollNext}
            {...props}
          >
            {iconType === "chev" ? (
              <ChevronRight color="#ffffff" />
            ) : (
              <ArrowRight color="#ffffff" />
            )}
            <span className="sr-only">Next slide</span>
          </button>
        )}
      </div>
    );
  }
);

const CarouselNavigationWithArrow = React.forwardRef(
  (
    {
      className,
      variant = "outline",
      size = "icon",
      count = 0,
      current = 0,
      ...props
    },
    ref
  ) => {
    const {
      orientation,
      scrollPrev,
      canScrollPrev,
      canScrollNext,
      scrollNext,
    } = useCarousel();

    return (
      <div className="flex items-center justify-center mt-6">
        <button
          ref={ref}
          variant="link"
          size={size}
          className="rtl:rotate-180"
          disabled={!canScrollPrev}
          onClick={scrollPrev}
          {...props}
        >
          <ArrowLeft size={24} color="black" />
          <span className="sr-only">Previous slide</span>
        </button>
        <div className="space-x-2 rtl:space-x-reverse flex mx-6">
          {Array.from({ length: count }).map((item, index) => (
            <div className="w-[24px] h-[24px] flex items-center justify-center">
              <div
                className={cn(
                  "w-[8px] h-[8px] rounded-full bg-[#D5DBE0]",
                  index === current - 1 && "w-[18px] h-[18px] bg-[#333333]"
                )}
              />
            </div>
          ))}
        </div>
        <button
          ref={ref}
          variant="link"
          size={size}
          disabled={!canScrollNext}
          className="rtl:rotate-180"
          onClick={scrollNext}
          {...props}
        >
          <ArrowRight size={24} color="black" />
          <span className="sr-only">Next slide</span>
        </button>
      </div>
    );
  }
);

CarouselNavigation.displayName = "CarouselNavigation";
const CarouselDots = ({ className }) => {
  const { api, currentIndex, setCurrentIndex } = useCarousel();

  const scrollTo = (index) => {
    if (api) {
      api.scrollTo(index);
      setCurrentIndex(index);
    }
  };

  const slidesCount = api ? api.scrollSnapList().length : 0;

  return (
    <div className="flex justify-center mt-4 gap-3">
      {Array.from({ length: slidesCount }).map((_, index) => (
        <button
          key={index}
          onClick={() => scrollTo(index)}
          className={`w-3 h-3 rounded-full ${className} ${index === currentIndex ? "bg-[#059669] " : "bg-gray-400"}`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
};

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselNavigation,
  CarouselNavigationWithArrow,
  CarouselDots,
};
