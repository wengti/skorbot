import Link from "next/link";
import Button from "../../my-ui/button";

export default function HeaderLoginBtn() {
    return (
        <Link href='/auth/login'>
            <Button size='sm'>Login</Button>
        </Link>
    )
}