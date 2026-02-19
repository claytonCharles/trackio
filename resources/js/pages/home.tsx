import { Link } from "@inertiajs/react";
import Exemple from "./guest/exemple";
import { exemple } from "@/routes";


export default function Home() {
	return (
		<>
			<h1>Hello World!</h1>
			<Link href={exemple()}>Exemple</Link>
		</>
	);
}