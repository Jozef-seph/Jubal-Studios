/**
 * Verifies sample WhatsApp message length (same shape as buildBookingWhatsAppMessage in js/main.js).
 * Booking forms open WhatsApp on submit with this message shape — optional sanity check before deploy.
 */

var WHATSAPP_NUMBER = "254115144078";

function waSanitizeValue(s) {
  return String(s || "")
    .replace(/\r\n/g, "\n")
    .replace(/\*/g, "·")
    .replace(/_/g, "·")
    .replace(/~/g, "·")
    .trim();
}

function sampleLessonMessage() {
  var lines = [];
  lines.push("*Jubal Studios*");
  lines.push("*Music lesson booking*");
  lines.push("");
  lines.push("*Full name:* " + waSanitizeValue("Test Student"));
  lines.push("*Programme:* " + waSanitizeValue("Piano"));
  lines.push("*Phone:* " + waSanitizeValue("+254 712 345 678"));
  lines.push("*Preferred schedule:* " + waSanitizeValue("Saturday mornings, from March"));
  lines.push("");
  lines.push("_Sent from the Jubal Studios website booking form._");
  return lines.join("\n");
}

function sampleRecordingMessage() {
  var lines = [];
  lines.push("*Jubal Studios*");
  lines.push("*Recording session booking*");
  lines.push("");
  lines.push("*Date:* 2026-05-22 (Fri, 22 May 2026)");
  lines.push("*Time:* 14:30");
  lines.push("*Service type:* " + waSanitizeValue("Mixing"));
  lines.push("*Name / artist:* " + waSanitizeValue("DJ Sample"));
  lines.push("*Phone:* " + waSanitizeValue("0700000000"));
  lines.push("");
  lines.push("_Sent from the Jubal Studios website booking form._");
  return lines.join("\n");
}

var lesson = sampleLessonMessage();
var rec = sampleRecordingMessage();
var encLesson = encodeURIComponent(lesson);
var encRec = encodeURIComponent(rec);

console.log("=== Jubal Studios — WhatsApp booking test ===\n");
console.log("WHATSAPP_NUMBER:", WHATSAPP_NUMBER, "(edit in js/main.js)\n");
console.log("--- Sample lesson message (plain) ---\n");
console.log(lesson);
console.log("\n--- Encoded length (lesson):", encLesson.length, "chars");
console.log("--- Encoded length (recording):", encRec.length, "chars");

if (encLesson.length > 2800 || encRec.length > 2800) {
  console.error("\nWARNING: Message may be too long for some devices.");
  process.exitCode = 1;
} else {
  console.log("\nOK: Under safe URL length limit.\n");
}

var url =
  "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encLesson.slice(0, 120) + "...[truncated for console]";
console.log("Example URL (truncated):\n", url);
console.log("\nManual test: submit a booking form in the browser — WhatsApp should open with a prefilled message.");
console.log("Use the studio's real number in js/main.js before going live.\n");
