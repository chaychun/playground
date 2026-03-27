import Image from "next/image";

import cover from "./scientific-american-cover.jpg";

export function ScientificAmericanCover() {
  return (
    <div className="my-8 flex justify-center">
      <Image
        src={cover}
        alt="Scientific American Cover November 1959"
        className="rounded-lg border border-zinc-200 shadow-md dark:border-zinc-800"
        style={{ width: "100%", height: "auto", maxWidth: "400px" }}
      />
    </div>
  );
}
