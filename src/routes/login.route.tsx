/**
 * Basé sur le modèle de Material UI 
 * https://github.com/mui/material-ui/tree/v5.14.4/docs/data/material/getting-started/templates/sign-in
 **/
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, logInWithEmailAndPassword } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { FormattedMessage } from 'react-intl';
import { useIntl } from 'react-intl';
function Copyright(props: any) {
return (
    <Typography
    variant="body2"
    color="text.secondary"
    align="center"
    {...props}
    >
    {'Copyright © '}
    Etienne Rivard {new Date().getFullYear()}
    {'.'}
    </Typography>
);
}

/**
 * 
 * CODE EMPRUNTÉ D'ÉTIENNE RIVARD
 */
const defaultTheme = createTheme();

function Login() {
    const intl = useIntl();
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) {
        // maybe trigger a loading screen
        return;
        }
        if (user) navigate('/');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, loading]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        logInWithEmailAndPassword(
        data.get('email') as string,
        data.get('password') as string
        );
    };

    return (
        <ThemeProvider theme={defaultTheme}>
        <Grid container component="main" sx={{ height: '87vh', width: '90vw' }}>
            <CssBaseline />
            <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
                backgroundImage:
                'url(https://source.unsplash.com/random?wallpapers)',
                backgroundRepeat: 'no-repeat',
                backgroundColor: (t) =>
                t.palette.mode === 'light'
                    ? t.palette.grey[50]
                    : t.palette.grey[900],
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
            />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <Box
                sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    <FormattedMessage
                        id="login.authentifierabibliotheque"
                        defaultMessage="authentifier"
                        values={{ }}
                    />
                </Typography>
                <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
                >
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label={intl.formatMessage({id: 'login.courriel'})}
                    name="email"
                    autoComplete="email"
                    autoFocus
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label={intl.formatMessage({id: 'login.mdp'})}
                    type="password"
                    id="password"
                    autoComplete="current-password"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    <FormattedMessage
                        id="login.boutonauthentifier"
                        defaultMessage="authentifier"
                        values={{ }}
                    />
                    
                </Button>
                <Copyright sx={{ mt: 5 }} />
                </Box>
            </Box>
            </Grid>
        </Grid>
        </ThemeProvider>
    );
}

/** FIN DU CODE EMPRUNTÉ */
export default Login;