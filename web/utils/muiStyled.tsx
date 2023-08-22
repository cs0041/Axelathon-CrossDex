import { makeStyles } from '@material-ui/core/styles'
import { styled } from '@mui/material/styles'
import  '../styles/font.module.css'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
export const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: '#ffffff',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    color: '#000000',
    backgroundColor: '#ffffff',
    boxShadow: theme.shadows[1],
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Inter',
  },
}))

