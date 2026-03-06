import { StrictMode } from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import '../css/app.css';
import { ToastProvider } from './hooks/use-toast';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
	title: (title) => (title ? `${title} - ${appName}` : appName),
	resolve: (name) =>
		resolvePageComponent(
			`./pages/${name}.tsx`,
			import.meta.glob('./pages/**/*.tsx'),
		),
	setup({ el, App, props }) {
		const root = createRoot(el);

		root.render(
			<StrictMode>
				<ToastProvider>
					<App {...props} />
				</ToastProvider>
			</StrictMode>,
		);
	},
	progress: {
		color: '#4B5563',
	},
});