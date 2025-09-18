export function compareArrays(input: number[], output: number[]): boolean {
  if (input.length !== output.length) {
    return false
  }

  input.sort((a, b) => a - b)
  output.sort((a, b) => a - b)

  for (let i = 0; i < input.length; i++) {
    if (input[i] !== output[i]) {
      return false
    }
  }

  return true
}
