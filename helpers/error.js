export default class MissingEnvVariableError extends Error {
  constructor(variableName) {
    super(`Missing required environment variable: ${variableName}`)
    this.name = "MissingEnvVariableError"
  }
}
