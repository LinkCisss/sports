import WidgetKit
import SwiftUI

@main
struct SportsLiveActivityBundle: WidgetBundle {
    var body: some Widget {
        if #available(iOS 16.1, *) {
            SportsLiveActivityWidget()
        }
    }
}
