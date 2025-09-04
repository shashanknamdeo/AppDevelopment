const app_log = true; // set false in production

const function_log = true; // set false in production

const ui_log = true; // set false in production

// ------------------------------------------------------------------------------------------------

export function appLog(log) {
  if (app_log) {
    console.log(log);
  }
}


export function functionLog(log) {
  if (function_log) {
    console.log(log);
  }
}


export function uiLog(log) {
  if (ui_log) {
    console.log(log);
  }
}

