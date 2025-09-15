import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";

interface Props {
  children: React.ReactNode;
}

const InitialProvider = ({ children }: Props) => {
  return (
    <QueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </QueryProvider>
  );
};

export default InitialProvider;
