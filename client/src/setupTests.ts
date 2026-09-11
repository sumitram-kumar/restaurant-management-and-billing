import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

// jsdom doesn't provide these; @auth0/auth0-react's real module needs them at
// import time even when its hooks are mocked in individual test files.
Object.assign(global, { TextEncoder, TextDecoder });
