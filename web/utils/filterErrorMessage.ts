export const filterErrorMessage = (message: string | undefined): string => {
  if (message) {
    switch (message) {
      default:
        return message
    }
  } else {
    return 'wrong network / disconnect wallet'
  }
}
