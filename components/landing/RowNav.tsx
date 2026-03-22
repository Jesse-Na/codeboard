import { Button } from "@/components/ui/button"
import Link from "next/link"

export function RowNav() {

  return (
        <div className="flex py-32 gap-4 justify-center">
            <Button size={'lg'}  key={"Dashboard"}>
                <Link href={"/dashboard"}>
                <span>Dashboard</span>
                </Link>
            </Button>
            <Button  size={'lg'} key={"JoinRoom"}>
                <Link href={"/dashboard"}>
                <span>Join a Room</span>
                </Link>
            </Button>
            <Button size={'lg'} key={"HostRoom"}>
                <Link href={"/dashboard"}>
                <span>Host a Room</span>
                </Link>
            </Button>
        </div>
  )
}
