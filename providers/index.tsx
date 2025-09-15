import { ThemeProvider } from "./theme-provider";

interface Props {
  children: React.ReactNode;
}

const InitialProvider = ({ children }: Props) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};

export default InitialProvider;
