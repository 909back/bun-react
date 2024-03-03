// hydrate.ts
/// <reference lib="dom" />

import { hydrateRoot } from 'react-dom/client';
import {App} from "./app";

hydrateRoot(document, <App />);