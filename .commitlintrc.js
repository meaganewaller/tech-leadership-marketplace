export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Subjects here carry a trailing mood emoji shortcode and bodies wrap at
    // 80 by hand, so the length and case rules fight the house style rather
    // than catching anything. Type and scope grammar is what matters, because
    // release-please reads it.
    "body-leading-blank": [0],
    "body-max-line-length": [0],
    "footer-max-line-length": [0],
    "header-max-length": [0],
    "subject-case": [0],
    "subject-full-stop": [0],
  },
};
