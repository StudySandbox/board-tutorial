import { ModeToggle } from "@/components/common/mode-toggle";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="space-y-2">
      {/* 다크모드 토글 */}
      <ModeToggle />

      <Button>버튼</Button>

      <div className="py-2 text-2xl font-bold">Font Weight</div>
      <div className="text-2xl font-thin">
        <span>세상에 이런 폰트가 나오다니 천재인듯 100</span>
        <span>&nbsp;[ font-thin ]</span>
      </div>
      <div className="text-2xl font-extralight">
        <span>세상에 이런 폰트가 나오다니 천재인듯 200</span>
        <span>&nbsp;[ font-extralight ]</span>
      </div>
      <div className="text-2xl font-light">
        <span>세상에 이런 폰트가 나오다니 천재인듯 300</span>
        <span>&nbsp;[ font-light ]</span>
      </div>
      <div className="text-2xl font-normal">
        <span>세상에 이런 폰트가 나오다니 천재인듯 400</span>
        <span>&nbsp;[ font-normal ]</span>
      </div>
      <div className="text-2xl font-medium">
        <span>세상에 이런 폰트가 나오다니 천재인듯 500</span>
        <span>&nbsp;[ font-medium ]</span>
      </div>
      <div className="text-2xl font-semibold">
        <span>세상에 이런 폰트가 나오다니 천재인듯 600</span>
        <span>&nbsp;[ font-semibold ]</span>
      </div>
      <div className="text-2xl font-bold">
        <span>세상에 이런 폰트가 나오다니 천재인듯 700</span>
        <span>&nbsp;[ font-bold ]</span>
      </div>
      <div className="text-2xl font-extrabold">
        <span>세상에 이런 폰트가 나오다니 천재인듯 800</span>
        <span>&nbsp;[ font-extrabold ]</span>
      </div>
      <div className="text-2xl font-black">
        <span>세상에 이런 폰트가 나오다니 천재인듯 900</span>
        <span>&nbsp;[ font-black ]</span>
      </div>
    </div>
  );
}
