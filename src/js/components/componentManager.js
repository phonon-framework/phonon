
const stack = []

export default {
  addComponentToStack(component) {
    stack.push(component)
  },
  removeComponentToStack(component) {
    const index = stack.findIndex(c => Object.is(component, c))
    if (index > -1) {
      stack.splice(index, 1)
    }
  },
  componentClosable(component) {
    return stack.length === 0 || Object.is(stack[stack.length - 1], component)
  }
}