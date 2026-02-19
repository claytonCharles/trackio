import { home } from "@/routes";
import { Link } from "@inertiajs/react";


export default function Exemple() {
	return (
		<>
			<h1>Exemple!</h1>
			<Link href={home()}>Home</Link>
		</>
	)
}