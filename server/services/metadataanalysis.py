import io
import re
from datetime import datetime
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS
from typing import Dict, List
import folium

class ImageMetadataPIIAnalyzer:
    """Comprehensive analyzer for detecting PII in image metadata"""
    def __init__(self):
        self.high_risk_fields = {
            'GPSInfo', 'GPS', 'GPSLatitude', 'GPSLongitude',
            'CameraOwnerName', 'OwnerName', 'Creator', 'Artist',
            'Copyright', 'Rights', 'Author'
        }
        self.medium_risk_fields = {
            'DateTime', 'DateTimeOriginal', 'DateTimeDigitized',
            'UserComment', 'ImageDescription', 'XPComment', 'XPAuthor',
            'XPKeywords', 'XPSubject', 'Subject', 'Keywords',
            'HostComputer', 'ProcessingSoftware'
        }
        self.low_risk_fields = {
            'Make', 'Model', 'Software', 'LensModel',
            'CameraSerialNumber', 'LensSerialNumber'
        }
        self.network_indicators = [
            'wifi', 'ssid', 'network', 'bluetooth', 'mac address',
            'ip address', 'router', 'access point'
        ]
        self.personal_patterns = {
            'email': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            'phone': r'[\+]?[1-9]?[0-9]{7,15}',
            'social_security': r'\b\d{3}-\d{2}-\d{4}\b',
            'credit_card': r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b',
            'address': r'\b\d+\s+[A-Za-z0-9\s,]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)\b'
        }
    def convert_gps_to_decimal(self, gps_coord, ref):
        try:
            if not gps_coord or len(gps_coord) != 3:
                return None
            degrees = float(gps_coord[0])
            minutes = float(gps_coord[1])
            seconds = float(gps_coord[2])
            decimal = degrees + (minutes / 60.0) + (seconds / 3600.0)
            if ref in ['S', 'W']:
                decimal = -decimal
            return decimal
        except (ValueError, TypeError, ZeroDivisionError):
            return None
    def extract_all_metadata(self, image_bytes):
        try:
            image = Image.open(io.BytesIO(image_bytes))
            exif_data = {}
            if hasattr(image, '_getexif') and image._getexif():
                exif_raw = image._getexif()
                for tag_id, value in exif_raw.items():
                    tag = TAGS.get(tag_id, tag_id)
                    exif_data[tag] = value
            if 'GPSInfo' in exif_data:
                gps_data = {}
                for gps_tag_id, value in exif_data['GPSInfo'].items():
                    gps_tag = GPSTAGS.get(gps_tag_id, gps_tag_id)
                    gps_data[gps_tag] = value
                exif_data['GPSInfo'] = gps_data
            metadata = {
                'exif': exif_data,
                'format': image.format,
                'mode': image.mode,
                'size': image.size,
            }
            if hasattr(image, 'info'):
                metadata['info'] = image.info
            return metadata
        except Exception as e:
            return {'error': f"Failed to extract metadata: {str(e)}"}
    def analyze_gps_data(self, exif_data: Dict) -> List[Dict]:
        findings = []
        if 'GPSInfo' in exif_data and isinstance(exif_data['GPSInfo'], dict):
            gps_info = exif_data['GPSInfo']
            if 'GPSLatitude' in gps_info and 'GPSLongitude' in gps_info:
                lat = self.convert_gps_to_decimal(
                    gps_info['GPSLatitude'], 
                    gps_info.get('GPSLatitudeRef', 'N')
                )
                lon = self.convert_gps_to_decimal(
                    gps_info['GPSLongitude'], 
                    gps_info.get('GPSLongitudeRef', 'E')
                )
                if lat and lon:
                    findings.append({
                        'type': 'GPS Coordinates',
                        'risk': 'CRITICAL',
                        'category': 'Location',
                        'data': f"Latitude: {lat:.6f}, Longitude: {lon:.6f}",
                        'concern': 'Exact location can reveal home, workplace, or personal places',
                        'recommendation': 'Remove GPS data before sharing'
                    })
            if 'GPSAltitude' in gps_info:
                findings.append({
                    'type': 'GPS Altitude',
                    'risk': 'MEDIUM',
                    'category': 'Location',
                    'data': f"Altitude: {gps_info['GPSAltitude']}",
                    'concern': 'Altitude data can help pinpoint exact location',
                    'recommendation': 'Consider removing altitude information'
                })
            gps_time_fields = ['GPSTimeStamp', 'GPSDateStamp']
            for field in gps_time_fields:
                if field in gps_info:
                    findings.append({
                        'type': 'GPS Timestamp',
                        'risk': 'HIGH',
                        'category': 'Temporal',
                        'data': str(gps_info[field]),
                        'concern': 'GPS timestamp reveals when you were at this location',
                        'recommendation': 'Remove GPS timestamps'
                    })
        return findings
    def analyze_temporal_data(self, exif_data: Dict) -> List[Dict]:
        findings = []
        timestamp_fields = {
            'DateTime': 'Image modification time',
            'DateTimeOriginal': 'Original photo capture time',
            'DateTimeDigitized': 'Digital processing time',
            'CreateDate': 'Creation timestamp',
            'ModifyDate': 'Last modification time'
        }
        found_timestamps = []
        for field, description in timestamp_fields.items():
            if field in exif_data and exif_data[field]:
                timestamp_str = str(exif_data[field])
                found_timestamps.append(f"{description}: {timestamp_str}")
        if found_timestamps:
            findings.append({
                'type': 'Timestamp Information',
                'risk': 'MEDIUM',
                'category': 'Temporal',
                'data': '; '.join(found_timestamps),
                'concern': 'Timestamps can establish patterns and reveal when/where photos were taken',
                'recommendation': 'Strip timestamp data for privacy'
            })
        return findings
    def analyze_device_information(self, exif_data: Dict) -> List[Dict]:
        findings = []
        device_info = {}
        device_fields = {
            'Make': 'Camera manufacturer',
            'Model': 'Camera model',
            'Software': 'Processing software',
            'LensModel': 'Lens information',
            'CameraSerialNumber': 'Camera serial number',
            'LensSerialNumber': 'Lens serial number',
            'HostComputer': 'Processing computer name'
        }
        for field, description in device_fields.items():
            if field in exif_data and exif_data[field]:
                device_info[description] = str(exif_data[field])
        if device_info:
            risk_level = 'HIGH' if any('serial' in k.lower() or 'computer' in k.lower() for k in device_info.keys()) else 'LOW'
            findings.append({
                'type': 'Device Information',
                'risk': risk_level,
                'category': 'Device',
                'data': '; '.join([f"{k}: {v}" for k, v in device_info.items()]),
                'concern': 'Device info enables fingerprinting and tracking across images',
                'recommendation': 'Remove device-specific identifiers'
            })
        return findings
    def analyze_user_content(self, exif_data: Dict, additional_info: Dict = None) -> List[Dict]:
        findings = []
        text_fields = {
            'UserComment': 'User comments',
            'ImageDescription': 'Image description',
            'Artist': 'Artist/Creator name',
            'Copyright': 'Copyright information',
            'XPComment': 'Windows comment',
            'XPAuthor': 'Windows author',
            'XPKeywords': 'Windows keywords',
            'XPSubject': 'Windows subject',
            'Keywords': 'Image keywords',
            'Subject': 'Image subject',
            'Creator': 'Creator information',
            'Rights': 'Rights information',
            'CameraOwnerName': 'Camera owner name'
        }
        for field, description in text_fields.items():
            content = None
            if field in exif_data and exif_data[field]:
                content = str(exif_data[field])
            elif additional_info and field in additional_info and additional_info[field]:
                content = str(additional_info[field])
            if content and content.strip():
                pii_matches = self.detect_personal_patterns(content)
                risk_level = 'HIGH' if pii_matches or any(sensitive in field.lower() for sensitive in ['owner', 'creator', 'artist', 'author']) else 'MEDIUM'
                truncated_content = content[:100] + "..." if len(content) > 100 else content
                concern = f"{description} may contain personal information"
                if pii_matches:
                    concern += f". Detected: {', '.join(pii_matches)}"
                findings.append({
                    'type': 'User Content',
                    'risk': risk_level,
                    'category': 'Personal',
                    'data': f"{description}: {truncated_content}",
                    'concern': concern,
                    'recommendation': 'Review and remove personal information from metadata fields'
                })
        return findings
    def detect_personal_patterns(self, text: str) -> List[str]:
        matches = []
        for pattern_name, pattern in self.personal_patterns.items():
            if re.search(pattern, text, re.IGNORECASE):
                matches.append(pattern_name)
        return matches
    def analyze_network_information(self, exif_data: Dict, additional_info: Dict = None) -> List[Dict]:
        findings = []
        def extract_strings(data, prefix=""):
            strings = []
            if isinstance(data, dict):
                for key, value in data.items():
                    strings.extend(extract_strings(value, f"{prefix}.{key}" if prefix else key))
            elif isinstance(data, (list, tuple)):
                for i, item in enumerate(data):
                    strings.extend(extract_strings(item, f"{prefix}[{i}]"))
            elif isinstance(data, str):
                strings.append((prefix, data))
            return strings
        all_strings = extract_strings(exif_data)
        if additional_info:
            all_strings.extend(extract_strings(additional_info))
        network_findings = []
        for field_path, text in all_strings:
            text_lower = text.lower()
            for indicator in self.network_indicators:
                if indicator in text_lower:
                    network_findings.append(f"{field_path}: {text[:50]}...")
        if network_findings:
            findings.append({
                'type': 'Network Information',
                'risk': 'HIGH',
                'category': 'Network',
                'data': '; '.join(network_findings),
                'concern': 'Network information can reveal home/work networks and enable tracking',
                'recommendation': 'Remove all network-related metadata'
            })
        return findings
    def calculate_overall_risk_score(self, findings: List[Dict]) -> Dict:
        if not findings:
            return {'score': 0, 'level': 'MINIMAL', 'summary': 'No privacy risks detected'}
        risk_weights = {'CRITICAL': 10, 'HIGH': 7, 'MEDIUM': 4, 'LOW': 2}
        total_score = sum(risk_weights.get(finding['risk'], 0) for finding in findings)
        if total_score >= 15:
            level = 'CRITICAL'
        elif total_score >= 10:
            level = 'HIGH'
        elif total_score >= 5:
            level = 'MEDIUM'
        else:
            level = 'LOW'
        risk_counts = {}
        for finding in findings:
            risk_counts[finding['risk']] = risk_counts.get(finding['risk'], 0) + 1
        summary_parts = []
        for risk, count in sorted(risk_counts.items(), key=lambda x: risk_weights.get(x[0], 0), reverse=True):
            summary_parts.append(f"{count} {risk.lower()} risk item{'s' if count > 1 else ''}")
        return {
            'score': total_score,
            'level': level,
            'summary': f"Found {', '.join(summary_parts)}",
            'total_findings': len(findings)
        }
    def analyze_comprehensive_pii(self, image_bytes) -> Dict:
        try:
            metadata = self.extract_all_metadata(image_bytes)
            if 'error' in metadata:
                return {'error': metadata['error']}
            exif_data = metadata.get('exif', {})
            additional_info = metadata.get('info', {})
            all_findings = []
            all_findings.extend(self.analyze_gps_data(exif_data))
            all_findings.extend(self.analyze_temporal_data(exif_data))
            all_findings.extend(self.analyze_device_information(exif_data))
            all_findings.extend(self.analyze_user_content(exif_data, additional_info))
            all_findings.extend(self.analyze_network_information(exif_data, additional_info))
            risk_assessment = self.calculate_overall_risk_score(all_findings)
            return {
                'analysis_timestamp': datetime.now().isoformat(),
                'risk_assessment': risk_assessment,
                'findings': all_findings,
                'metadata_summary': {
                    'format': metadata.get('format'),
                    'size': metadata.get('size'),
                    'mode': metadata.get('mode'),
                    'total_metadata_fields': len(exif_data) + len(additional_info)
                },
                'exif_data': exif_data
            }
        except Exception as e:
            return {'error': f"Analysis failed: {str(e)}"}

def create_metadata_map(exif_data):
    """Create a map showing GPS location from metadata"""
    if 'GPSInfo' not in exif_data:
        return None
    gps_info = exif_data['GPSInfo']
    if 'GPSLatitude' not in gps_info or 'GPSLongitude' not in gps_info:
        return None
    def convert_gps_to_decimal(gps_coords, gps_ref):
        try:
            degrees, minutes, seconds = gps_coords
            decimal = float(degrees) + float(minutes)/60 + float(seconds)/3600
            if gps_ref in ['S', 'W']:
                decimal = -decimal
            return decimal
        except:
            return None
    lat = convert_gps_to_decimal(gps_info['GPSLatitude'], gps_info.get('GPSLatitudeRef', 'N'))
    lon = convert_gps_to_decimal(gps_info['GPSLongitude'], gps_info.get('GPSLongitudeRef', 'E'))
    if not lat or not lon:
        return None
    m = folium.Map(location=[lat, lon], zoom_start=15)
    folium.Marker(
        location=[lat, lon],
        tooltip=f"Photo taken here: {lat:.6f}, {lon:.6f}",
        popup=f"GPS Coordinates from EXIF data<br>Lat: {lat:.6f}<br>Lon: {lon:.6f}",
        icon=folium.Icon(color='red', icon='camera')
    ).add_to(m)
    return m 