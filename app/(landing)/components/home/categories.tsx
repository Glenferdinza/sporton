import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const categoryList = [
  {
    name: "Running",
    imgUrl: "category-running.png",
  },
  {
    name: "Tennis",
    imgUrl: "category-tennis.png",
  },
  {
    name: "Basketball",
    imgUrl: "category-basketball.png",
  },
  {
    name: "Football",
    imgUrl: "category-football.png",
  },
  {
    name: "Swimming",
    imgUrl: "category-swimming.png",
  },
  {
    name: "Badminton",
    imgUrl: "category-badminton.png",
  },
];

const CategoriesSection = () => {
  return (
    <section id="category-section" className="container mx-auto pb-20">
      <div className="flex justify-between">
        <h2 className="font-bold text-2xl">Browse By Categories</h2>
        <Link
          href="#"
          className="flex gap-2 text-primary font-medium items-center"
        >
          See All Categories
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
      <div className="grid grid-cols-6 gap-12 mt-8 ">
        {categoryList.map((category, index) => (
          <div
            className="rounded-lg bg-gradient-to-r from-[#F1F1F1] to-[#F7F7F7] w-full aspect-square flex flex-col items-center justify-center p-4"
            key={index}
          >
            <div className="self-center">
              <Image
                src={`/images/categories/${category.imgUrl}`}
                width={86}
                height={86}
                alt={category.name}
                className="mb-[10px]"
              />
              <div className="text-primary font-medium text-xl mt-4 text-center">
                {category.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
